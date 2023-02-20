const fichero = new URL("http://localhost:3000/invitados");
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');
  
  const mainDiv = document.querySelector('.main');
  const ul = document.getElementById('invitedList');
  
  const div = document.createElement('div');
  const filterLabel = document.createElement('label');
  const filterCheckBox = document.createElement('input');
  
  filterLabel.textContent = "Ocultar los que no hayan respondido";
  filterCheckBox.type = 'checkbox';
  div.appendChild(filterLabel);
  div.appendChild(filterCheckBox);
  mainDiv.insertBefore(div, ul);
  filterCheckBox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const lis = ul.children;
    if(isChecked) {
      for (let i = 0; i < lis.length; i += 1) {
        let li = lis[i];
        if (li.className === 'responded') {
          li.style.display = '';  
        } else {
          li.style.display = 'none';                        
        }
      }
    } else {
      for (let i = 0; i < lis.length; i += 1) {
        let li = lis[i];
        li.style.display = '';
      }                                 
    }
  });
  
  function createLI(text) {
    function createElement(elementName, property, value) {
      const element = document.createElement(elementName);  
      element[property] = value; 
      return element;
    }
    
    function appendToLI(elementName, property, value) {
      const element = createElement(elementName, property, value);     
      li.appendChild(element); 
      return element;
    }
    
    const li = document.createElement('li');
    appendToLI('span', 'textContent', text);     
    appendToLI('label', 'textContent', 'Confirmed')
      .appendChild(createElement('input', 'type', 'checkbox'));
    appendToLI('button', 'textContent', 'edit');
    appendToLI('button', 'textContent', 'remove');
    return li;
  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    input.value = '';

    const xhttp = new XMLHttpRequest();

    xhttp.open('POST',fichero,true);//We open the Json 

    xhttp.setRequestHeader("Content-Type", "application/json");
    let invitado = JSON.stringify({"id": 0, "nombre": text, "confirmado": false });// We create a new Json object by stringify
    xhttp.send(invitado);//We send it

    li = createLI(text);
    ul.appendChild(li);
    location.reload();
  });
    
  ul.addEventListener('change', (e) => {
    const checkbox = event.target;
    const checked = checkbox.checked;
    const listItem = checkbox.parentNode.parentNode;
    
    if (checked) {
      listItem.className = 'responded';
      let nombre=listItem.getElementsByTagName("span")[0].textContent;
      id= listItem.id;// We create a variable id with the id of the listItem
      let dato= document.getElementById(id);
      let confirmed = dato.getElementsByTagName("input")[0].checked;
      const xhttp = new XMLHttpRequest();
      xhttp.open('PUT',fichero+"/"+id,true);//We open the Json;
      xhttp.setRequestHeader("Content-Type", "application/json");
      let invitado = JSON.stringify({"id": id,"nombre":nombre,"confirmado": confirmed });
      xhttp.send(invitado);//We send it
      setTimeout(function(){
        window.location.reload();
     }, 2000);
    } else {
      listItem.className = '';
      let nombre=listItem.getElementsByTagName("span")[0].textContent;
      id = listItem.id;// We create a variable id with the id of the listItem
      const xhttp = new XMLHttpRequest();
      xhttp.open('PUT',fichero+"/"+id,true);//We open the Json;
      xhttp.setRequestHeader("Content-Type", "application/json");//We set the headers
      let invitado = JSON.stringify({"id": id,"nombre":nombre,"confirmado": false });//We create a json object
      xhttp.send(invitado);//We send it
      setTimeout(function(){
        window.location.reload();
     }, 2000);//We set a timeout of 2 seconds and we reload the page
    }
  });
    
  ul.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const button = e.target;
      const li = button.parentNode;
      const ul = li.parentNode;
      const action = button.textContent;
      const nameActions = {
        remove: () => {
          ul.removeChild(li);
          id= li.id;// We create a variable id with the id of the li
          const xhttp = new XMLHttpRequest();
          xhttp.open('DELETE',fichero+"/"+id,true);//We open the Json and delete the object by id
          xhttp.send();//We send it
    
        },
        edit: () => {
          const span = li.firstElementChild;
          const input = document.createElement('input');
          input.type = 'text';
          input.value = span.textContent;
          li.insertBefore(input, span);
          li.removeChild(span);
          button.textContent = 'save';  
        },
        save: () => {
          const input = li.firstElementChild;
          const span = document.createElement('span');
          span.textContent = input.value;
          li.insertBefore(span, input);
          li.removeChild(input);
          button.textContent = 'edit';
          id= li.id;// We create a variable id with the id of the li
          let dato= document.getElementById(id);// We create a variable dato with the content of the element with the id
          let confirmed = dato.getElementsByTagName("input")[0].checked;//We save the status of the checkbox in a variable
          const xhttp = new XMLHttpRequest();
          xhttp.open('PUT',fichero+"/"+id,true);//We open the Json;
          xhttp.setRequestHeader("Content-Type", "application/json");//We set the headers
          let invitado = JSON.stringify({"id": id, "nombre": span.textContent, "confirmado": confirmed });// We create a json object
          xhttp.send(invitado);//We send it    
          location.reload();// We reload the page
        }
      };
      
      // select and run action in button's name
      nameActions[action]();
    }
  });  
  //We make an HttpRequest to read the Json
  const xhttp = new XMLHttpRequest();
  xhttp.open('GET',fichero,true);//We open the Json 
  xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){//We check that all is correct
      let datos = JSON.parse(this.responseText);//We create a variable and we parse the content of the json by responseText
      for(let objeto of datos){//We create a variable objeto where we put the data of the variable datos
        const li = createLI(objeto.nombre);//We create a new LI with the name that we have in the json file bu objeto.nombre
        li.id=objeto.id;
        id=li.id;
        li.confirmado=objeto.confirmado;
        ul.appendChild(li);//We added to the ul
        if(objeto.confirmado == true){//We check if the checkbox is checked or no by the information we have in the json file
          let li = document.getElementById(id);//We go through the li
          li.className="responded";// We gave the li a class name responded
          li.getElementsByTagName("input")[0].checked=true;//We manually check the checkbox by using checked=true
         }
      }      
    }
  }
  xhttp.send();//We send it
});  
