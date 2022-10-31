import Components from './component';
const INSTALLED_KEY = Symbol('INSTALLED_KEY');

export const makeInstaller = (components) => {
  const install = (app, options) => {
    if (app[INSTALLED_KEY]) return;

    app[INSTALLED_KEY] = true;
    components.forEach(c => app.use(c));
  };

  return {
    install,
  };
};

export default makeInstaller([...Components]);