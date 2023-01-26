const getHealth = async function (_req: any, res: any) {
  res.send({ health: 'OK TEST2' });
};

export { getHealth };
