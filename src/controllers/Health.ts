const getHealth = async function (_req: any, res: any) {
  res.status(200).send({ health: 'OK' });
};

export { getHealth };
