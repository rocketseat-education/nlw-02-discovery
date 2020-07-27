function addTimeField() {
    const container = document.querySelector('fieldset#schedule-items')
    const fieldContainer = document.querySelectorAll(".schedule-item");

    // Realiza um clone do último horário adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Esvaziar os valores dos inputs
    const inputs = newField.querySelectorAll('input')
    for (let input of inputs) {
        input.value = ""
    }
    
    // adicionar os campos ao container
    container.appendChild(newField);
  }
  
  document
    .querySelector("#add-time")
    .addEventListener("click", addTimeField);