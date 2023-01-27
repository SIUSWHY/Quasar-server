const getHealth = async function (_req: any, res: any) {
  res.send({ health: 'OK' });
};

export { getHealth };
