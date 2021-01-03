/**
 * Created by bolorundurowb on 1/3/2021
 */

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  auth: {
    secret: process.env.SECRET,
  },
  database: {
    url: process.env.DB_URL,
  },
});
