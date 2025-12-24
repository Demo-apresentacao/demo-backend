import pool from '../config/db.js';
 
//  GET /users
//  Lista todos os usuários (com opção de filtro ?search=texto)
export const listUsers = async (req, res, next) => {
  try {
    const { search } = req.query;

    // 1. INÍCIO DA QUERY (Mudei para template string com quebra de linha para garantir espaço)
    let queryText = `
      SELECT 
        usu_id, 
        usu_nome, 
        usu_cpf, 
        usu_data_nasc, 
        usu_sexo, 
        usu_telefone, 
        usu_email, 
        usu_observ, 
        usu_acesso, 
        usu_situacao 
      FROM usuarios`
    ; 

    const values = [];

    // 2. CONCATENAÇÃO (Note o espaço no início da string " WHERE...")
    if (search) {
      queryText +=  ` WHERE usu_nome ILIKE $1 OR usu_email ILIKE $1`;
      values.push(`%${search}%`);
    }

    // 3. ORDENAÇÃO (Note o espaço no início da string " ORDER BY...")
    queryText +=  ` ORDER BY usu_id DESC`;

    // --- DEBUG ---
    // Olhe no seu terminal onde roda o servidor. Isso vai mostrar a query montada.
    console.log("SQL GERADO:", queryText);
    console.log("VALORES:", values);
    // -------------

    // 4. EXECUÇÃO
    const result = await pool.query(queryText, values);

    return res.status(200).json({
      status: 'success',
      data: result.rows
    });

  } catch (error) {
    console.error("ERRO DETALHADO:", error);
    // Passa o erro para o próximo middleware
    next(error);
  }
};

//  GET /users/:id
//  Busca os dados de um usuário pelo ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        usu_id,
        usu_nome,
        usu_cpf,
        usu_data_nasc,
        usu_sexo,
        usu_telefone,
        usu_email,
        usu_observ,
        usu_acesso,
        usu_situacao
      FROM usuarios
      WHERE usu_id = $1;
    `;

    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado'
      });
    }

    return res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

//  POST /users
//   Cadastra um novo usuário
// POST /users
export const createUser = async (req, res, next) => {
  try {
    const {
      usu_nome,
      usu_cpf,
      usu_data_nasc,
      usu_sexo,
      usu_telefone,
      usu_email,
      usu_observ,
      usu_acesso,
      usu_senha,
      usu_situacao
    } = req.body;

    if (!usu_nome || !usu_cpf || !usu_email || !usu_senha) {
      return res.status(400).json({
        status: 'error',
        message: 'Campos obrigatórios não informados'
      });
    }

    const query = `
      INSERT INTO usuarios (
        usu_nome,
        usu_cpf,
        usu_data_nasc,
        usu_sexo,
        usu_telefone,
        usu_email,
        usu_observ,
        usu_acesso,
        usu_senha,
        usu_situacao
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
      RETURNING usu_id;
    `;

    const values = [
      usu_nome,
      usu_cpf,
      usu_data_nasc,
      usu_sexo,
      usu_telefone,
      usu_email,
      usu_observ || null,
      usu_acesso ?? false,
      usu_senha,
      usu_situacao ?? true
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({
      status: 'success',
      message: 'Usuário criado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};


  // PATCH /users/:id
  // Atualiza os dados de um usuário
 
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      usu_nome,
      usu_cpf,
      usu_data_nasc,
      usu_sexo,
      usu_telefone,
      usu_email,
      usu_observ,
      usu_acesso,
      usu_senha,
      usu_situacao
    } = req.body;

    const query = `
      UPDATE usuarios
      SET
        usu_nome = $1,
        usu_cpf = $2,
        usu_data_nasc = $3,
        usu_sexo = $4,
        usu_telefone = $5,
        usu_email = $6,
        usu_observ = $7,
        usu_acesso = $8,
        usu_senha = $9,
        usu_situacao = $10
      WHERE usu_id = $11;
    `;

    await pool.query(query, [
      usu_nome,
      usu_cpf,
      usu_data_nasc,
      usu_sexo,
      usu_telefone,
      usu_email,
      usu_observ,
      usu_acesso,
      usu_senha,
      usu_situacao,
      id
    ]);

    return res.json({
      status: 'success',
      message: 'Usuário atualizado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

//  PATCH /users/:id/status
//  Ativa ou desativa (oculta) um usuário
 
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { usu_situacao } = req.body;

    const query = `
      UPDATE usuarios
      SET usu_situacao = $1
      WHERE usu_id = $2;
    `;

    await pool.query(query, [usu_situacao, id]);

    return res.json({
      status: 'success',
      message: `Usuário ${usu_situacao ? 'ativado' : 'desativado'} com sucesso`
    });
  } catch (error) {
    next(error);
  }
};


//  DELETE /users/:id
//  Remove um usuário
 
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM usuarios WHERE usu_id = $1;',
      [id]
    );

    return res.json({
      status: 'success',
      message: 'Usuário removido com sucesso'
    });
  } catch (error) {
    next(error);
  }
};
