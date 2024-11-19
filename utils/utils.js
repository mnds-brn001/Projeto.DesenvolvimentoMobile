import { Clipboard } from 'react-native';

function formatContact(contact) {
  return contact.replace(/\D/g, '');
}

function capitalize(string) {
  return string
    .toLowerCase()
    .split(' ')
    .map(palavra => palavra.charAt(0).toLocaleUpperCase() + palavra.slice(1))
    .join(' ');
}

function copyContact(client) {
  let copyContact = formatContact(client.contact);
  Clipboard.setString(copyContact);
  alert("Contato de: " + client.name + " copiado para a área de transferência");
}





export { formatContact, capitalize, copyContact };
