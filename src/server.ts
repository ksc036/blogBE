import app from "./app";
import { startAllCrons } from "./cron";

const PORT = process.env.PORT || 2999;
startAllCrons(); // ✅ 서버 시작 시 크론도 등록
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
