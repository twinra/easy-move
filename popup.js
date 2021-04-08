const listFolders = (folder) => [
  folder,
  ...folder.subFolders.flatMap(sf => listFolders(sf))
];

const listAccount = (account) => [...account.folders.flatMap(f => listFolders(f))];

const toOption = (path) => {
  const option = document.createElement("option");
  option.value = path;
  return option;
};

browser.accounts.getDefault()
  .then(account => {
    const folders = listAccount(account);
    document.getElementById('folders-list').append(...folders.map(f => toOption(f.path)));
    document.getElementById('folders-input').addEventListener('change', (event) => {
      const newPath = event.target.value;
      const destination = folders.find(f => f.path === newPath);
      if(!destination) {
        console.error(`unknown path: ${newPath}`);
        return;
      }
      browser.mailTabs.getSelectedMessages()
        .then(msglist => {
          browser.messages.move(msglist.messages.map(m => m.id), destination);
          window.close();
        });
    });
  });
