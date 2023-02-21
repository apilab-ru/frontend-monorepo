function jiraFetch(list, domain) {
  function sendLog(key, item) {
    return fetch("https://" + domain + "/rest/api/2/issue/" + key + "/worklog", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en,ru;q=0.9,ru-RU;q=0.8,en-US;q=0.7",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Google Chrome\";v=\"110\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": "https://" + domain + "/secure/WorklogsAction!show.jspa",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": JSON.stringify(item),
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    })
  }

  function nextSend() {
    if (list.length) {

      const { task, ...item } = list.shift();

      return sendLog(task, item).catch(() => {
        console.log('error send', task, item);
      }).then(() => nextSend());
    } else {
      console.log('Complete!');
      return Promise.resolve();
    }
  }

  console.log('Start');
  nextSend();
}

export { jiraFetch }
