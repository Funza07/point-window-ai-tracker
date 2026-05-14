import app from "./app.js";
import { env } from "./config/env.js";
const PORT = process.env.PORT || env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on :${PORT}`));
