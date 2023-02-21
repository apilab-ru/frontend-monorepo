(function(){
  const data = {};
  const keys = ['setting', 'task-map', 'times', 'timeIntegrations'];

  keys.forEach(key => {
    data[key] = localStorage.getItem(key);
  })

  let code = `
  (function(){
    const list = ${JSON.stringify(data)};
    Object.entries(list).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    })
    console.log('Complete!')
  })();`;

  copy(code);

  console.log('Copied!');
})();