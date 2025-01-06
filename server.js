import { app } from './app.js';

const PORT = app.get('PORT');
app.listen(PORT, () => console.log(`⚡️Server is up and running on http://localhost:${PORT}`));
