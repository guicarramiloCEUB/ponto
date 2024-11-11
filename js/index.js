// Organizar código
const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");
const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");

btnRegistrarPonto.addEventListener("click", register);

diaSemana.textContent = getWeekDay();
dataAtual.textContent = getCurrentDate();

const dialogPonto = document.getElementById("dialog-ponto");

const dialogData = document.getElementById("dialog-data");
dialogData.textContent = "Data: " + getCurrentDate();

const dialogHora = document.getElementById("dialog-hora");

const selectRegisterType = document.getElementById("register-type");

// Finalizar a função
function setRegisterType() {
    let lastType = localStorage.getItem("lastRegisterType");
    if (lastType === "entrada") {
        selectRegisterType.value = "intervalo";
    } else if (lastType === "intervalo") {
        selectRegisterType.value = "volta-intervalo";
    } else if (lastType === "volta-intervalo") {
        selectRegisterType.value = "saida";
    } else if (lastType === "saida") {
        selectRegisterType.value = "entrada";
    }
}

const btnDialogRegister = document.getElementById("btn-dialog-register");
btnDialogRegister.addEventListener("click", async () => {
    // Pensar: o que fazer quando um usuário registrar o mesmo tipo de ponto
    // dentro de x minutos?

    let register = await getObjectRegister(selectRegisterType.value);
    saveRegisterLocalStorage(register);

    localStorage.setItem("lastRegister", JSON.stringify(register));

    const alertaSucesso = document.getElementById("alerta-ponto-registrado");
    alertaSucesso.classList.remove("hidden");
    alertaSucesso.classList.add("show");

    setTimeout(() => {
        alertaSucesso.classList.remove("show");
        alertaSucesso.classList.add("hidden");
    }, 5000);

    dialogPonto.close();
});

// Cria um objeto correspondente a um registro de ponto
// com data/hora/localização atualizados
// O parâmetro é o tipo de ponto
async function getObjectRegister(registerType) {
    const location = await getUserLocation();

    console.log(location);

    let ponto = {
        date: getCurrentDate(),
        time: getCurrentTime(),
        location: location,
        id: 1,
        type: registerType
    };
    return ponto;
}

const btnDialogFechar = document.getElementById("dialog-fechar");
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
});

let registersLocalStorage = getRegisterLocalStorage("register");

function saveRegisterLocalStorage(register) {
    registersLocalStorage.push(register);
    localStorage.setItem("register", JSON.stringify(registersLocalStorage));
}

function getRegisterLocalStorage(key) {
    let registers = localStorage.getItem(key);

    if (!registers) {
        return [];
    }

    return JSON.parse(registers);
}

// Função para obter a localização do usuário usando promessas
function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                resolve(userLocation);
            },
            (error) => {
                reject("Erro ao obter localização: " + error.message);
            }
        );
    });
}

function register() {
    const dialogUltimoRegistro = document.getElementById("dialog-ultimo-registro");
    let lastRegister = JSON.parse(localStorage.getItem("lastRegister"));

    if (lastRegister) {
        let lastDateRegister = lastRegister.date;
        let lastTimeRegister = lastRegister.time;
        let lastRegisterType = lastRegister.type;

        dialogUltimoRegistro.textContent = "Último Registro: " + lastDateRegister + " | " + lastTimeRegister + " | " + lastRegisterType;
    }

    dialogHora.textContent = "Hora: " + getCurrentTime();

    let interval = setInterval(() => {
        dialogHora.textContent = "Hora: " + getCurrentTime();
    }, 1000);

    dialogPonto.addEventListener("close", () => clearInterval(interval));

    dialogPonto.showModal();
}

const btnJustificarAusencia = document.getElementById(
    "btn-justificar-ausencia"
  );
  const dialogJustificativa = document.getElementById("dialog-justificativa");
  const justificativaDataInput = document.getElementById("justificativa-data");
  const justificativaTexto = document.getElementById("justificativa-texto");
  const justificativaArquivo = document.getElementById("justificativa-arquivo");
  const btnEnviarJustificativa = document.getElementById(
    "btn-enviar-justificativa"
  );
  const btnDialogJustificativaFechar = document.getElementById(
    "dialog-justificativa-fechar"
  );
  
  btnJustificarAusencia.addEventListener("click", openDialogJustificativa);
  
  function openDialogJustificativa() {
    const now = new Date();
    justificativaDataInput.value = formatDateInput(now);
    justificativaDataInput.max = formatDateInput(now);
    justificativaTexto.value = "";
    justificativaArquivo.value = "";
    dialogJustificativa.showModal();
  }
  
  btnDialogJustificativaFechar.addEventListener("click", () => {
    dialogJustificativa.close();
  });
  
  btnEnviarJustificativa.addEventListener("click", enviarJustificativa);
  
function enviarJustificativa(e) {
    e.preventDefault();
    const selectedDate = justificativaDataInput.value;
    const justificativa = justificativaTexto.value;
    const arquivo = justificativaArquivo.files[0];
  
    const now = new Date();
    const [year, month, day] = selectedDate.split("-");
    const date = new Date(year, month - 1, day);
    if (date > now) {
      showAlert("Não é possível justificar uma data futura.", true);
      return;
    }
  
    let arquivoNome = null;
    let arquivoUrl = null;
  
    if (arquivo) {
      arquivoNome = arquivo.name;
      arquivoUrl = URL.createObjectURL(arquivo);
    }
  
    const justificativaObj = {
      id: generateId(),
      date: formatDate(date),
      justificativa: justificativa,
      arquivo: arquivoNome,
      arquivoUrl: arquivoUrl,
    };
    saveJustificativa(justificativaObj);
  
    showAlert("Justificativa registrada com sucesso!");
  
    dialogJustificativa.close();
}

function saveJustificativa(justificativa) {
    let justificativas = JSON.parse(localStorage.getItem("justificativas")) || [];
    justificativas.push(justificativa);
    localStorage.setItem("justificativas", JSON.stringify(justificativas));
}


function updateContentHour() {
    horaAtual.textContent = getCurrentTime();
}

function getCurrentTime() {
    const date = new Date();
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

function getCurrentDate() {
    const date = new Date();
    let mes = date.getMonth() + 1;
    return String(date.getDate()).padStart(2, '0') + "/" + String(mes).padStart(2, '0') + "/" + String(date.getFullYear()).padStart(2, '0');
}

function getWeekDay() {
    const date = new Date();
    const day = date.getDay();
    const daynames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return daynames[day];
}

updateContentHour();
setInterval(updateContentHour, 1000);

console.log(getCurrentTime());
console.log(getCurrentDate());
console.log(getWeekDay());
