import HttpError from "../helpers/HttpError.js";
import controllerDecorator from "../helpers/controllerDecorator.js";
import * as cardServices from "../services/cardServices.js";
import { getColumnByFilter, updateColumn } from "../services/columnServices.js";
import { updateBoard } from "../services/boardServices.js";

export const createCard = async (req, res) => {
  const { columnId: column, boardId: board } = req.params;
  const { title } = req.body;
  const card = await cardServices.getCardByFilter({ column, title });
  if (card) {
    throw HttpError(409, "This title already exists");
  }
  const result = await cardServices.createCard({
    ...req.body,
    column,
    board,
  });
  const { _id: cardId } = result;
  await updateColumn({ _id: column }, { $push: { cards: cardId } });
  await updateBoard({ _id: board }, { $push: { cards: cardId } });
  res.status(201).json(result);
};

const getAllCards = async (req, res) => {
  const { columnId: column } = req.params;
  const filter = { column };
  const result = await cardServices.getAllCards(filter);
  const total = await cardServices.countCards(filter);
  res.json({ result, total });
};

const getOneCadr = async (req, res) => {
  const { columnId: column, id } = req.params;
  const result = await cardServices.getCardByFilter({ column, _id: id });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateCard = async (req, res) => {
  const { columnId: column, id } = req.params;
  const { title } = req.body;
  const card = await cardServices.getCardByFilter({ column, title });
  if (card) {
    throw HttpError(409, "This title already exists");
  }
  const result = await cardServices.updateCard({ column, _id: id }, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateCardColumn = async (req, res) => {
  const { columnId, id: cardId, boardId: board } = req.params;
  const { column } = req.body;
  const columnInBoard = await getColumnByFilter({ board, _id: columnId });
  if (!columnInBoard) {
    throw HttpError(404, "Column not found");
  }
  await updateColumn({ _id: columnId }, { $pull: { cards: cardId } });
  await updateColumn({ _id: column }, { $push: { cards: cardId } });
  const result = await cardServices.updateCard(
    { column: columnId, _id: cardId },
    req.body
  );
  if (!result) {
    throw HttpError(404, "Card not found");
  }
  res.json(result);
};

const deleteCard = async (req, res) => {
  const { columnId: column, id } = req.params;
  const result = await cardServices.deleteCard({ column, _id: id });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  await updateColumn({ _id: column }, { $pull: { cards: id } });
  await updateBoard({ columns: column }, { $pull: { cards: id } });
  res.json(result);
};

export default {
  createCard: controllerDecorator(createCard),
  getAllCards: controllerDecorator(getAllCards),
  getOneCard: controllerDecorator(getOneCadr),
  updateCard: controllerDecorator(updateCard),
  updateCardColumn: controllerDecorator(updateCardColumn),
  deleteCard: controllerDecorator(deleteCard),
};
