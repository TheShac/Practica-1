import {
  getAllUsersService, getUserService, createUserService,
  updateUserService, updatePasswordService, deleteUserService,
  getRolesService, createRolService, updateRolService, deleteRolService,
  getRolesAcademicoService, createRolAcademicoService,
  updateRolAcademicoService, deleteRolAcademicoService,
  getAcademicosService, getAcademicoFullProfileService,
  updateAcademicoProfileService,
} from './user.service.js';

// Wrapper genérico: evita repetir el try/catch en cada handler
const handle = (fn) => async (req, res) => {
  try {
    const result = await fn(req, res);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(err.status ?? 500).json({ message: err.message });
  }
};

// ── Usuario ────────────────────────────────────────────────────────────────

export const getAllUsers = handle((req) => getAllUsersService());

export const getUser = handle((req) => getUserService(req.params.id));

export const createUserHandler = handle(async (req, res) => {
  const user = await createUserService(req.body);
  res.status(201);      // status antes de que handle llame res.json()
  return user;
});

export const updateUserHandler = handle((req) =>
  updateUserService(req.params.id, req.body)
);

export const updatePasswordHandler = handle((req) =>
  updatePasswordService(req.params.id, req.body.password)
);

export const deleteUserHandler = handle((req) => deleteUserService(req.params.id));

// ── Rol ────────────────────────────────────────────────────────────────────

export const getRoles = handle(() => getRolesService());

export const createRolHandler = handle(async (req, res) => {
  const rol = await createRolService(req.body.nombre);
  res.status(201);
  return rol;
});

export const updateRolHandler = handle((req) =>
  updateRolService(req.params.id, req.body.nombre)
);

export const deleteRolHandler = handle((req) => deleteRolService(req.params.id));

// ── Rol Académico ──────────────────────────────────────────────────────────

export const getRolesAcademico = handle(() => getRolesAcademicoService());

export const createRolAcademicoHandler = handle(async (req, res) => {
  const rol = await createRolAcademicoService(req.body.tipo_academico);
  res.status(201);
  return rol;
});

export const updateRolAcademicoHandler = handle((req) =>
  updateRolAcademicoService(req.params.id, req.body.tipo_academico)
);

export const deleteRolAcademicoHandler = handle((req) =>
  deleteRolAcademicoService(req.params.id)
);

// ── Académicos ─────────────────────────────────────────────────────────────

export const getAcademicos = handle(() => getAcademicosService());

export const getAcademicoFullProfileHandler = handle((req) =>
  getAcademicoFullProfileService(req.params.id)
);

export const updateAcademicoProfileHandler = handle((req) =>
  updateAcademicoProfileService(parseInt(req.params.id), req.body, req.user)
);