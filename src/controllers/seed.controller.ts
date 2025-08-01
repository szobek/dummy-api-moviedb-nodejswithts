import db from "../config/knex";

const runSeed = async () => {
    let data=null
  try {
    await db.seed.run();
    data=1
  } catch (err) {
    console.log(err);
  }
  return data;
};

export default runSeed;