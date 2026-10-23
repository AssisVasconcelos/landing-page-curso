document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTOS DO DOM
  const btnCta = document.getElementById("btn-cta");
  const formInscricao = document.getElementById("form-inscricao");
  const boxAgradecimento = document.getElementById("mensagem-agradecimento");
  const feedbackTexto = document.getElementById("feedback-texto");
  const btnNovoCadastro = document.getElementById("btn-novo-cadastro");

  const campoCep = document.getElementById("cep");
  const cepStatus = document.getElementById("cep-status");
  const campoLogradouro = document.getElementById("logradouro");
  const campoBairro = document.getElementById("bairro");
  const campoCidade = document.getElementById("cidade");
  const campoUf = document.getElementById("uf");

  // 1. AÇÃO DO BOTÃO CALL TO ACTION (CTA)
  btnCta.addEventListener("click", () => {
    const secaoContato = document.getElementById("contato");
    secaoContato.scrollIntoView({ behavior: "smooth" });

    // Foca no primeiro campo do formulário após rolar
    setTimeout(() => {
      document.getElementById("nome").focus();
    }, 600);
  });

  // 2. CONSUMO DA API VIACEP
  campoCep.addEventListener("blur", () => {
    let cep = campoCep.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cep.length === 8) {
      cepStatus.textContent = "Buscando endereço...";
      cepStatus.className = "cep-hint";

      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => {
          if (!response.ok) throw new Error("Erro na requisição");
          return response.json();
        })
        .then((data) => {
          if (data.erro) {
            cepStatus.textContent = "CEP não encontrado!";
            cepStatus.className = "cep-hint erro";
            limparCamposEndereco();
          } else {
            campoLogradouro.value = data.logradouro;
            campoBairro.value = data.bairro;
            campoCidade.value = data.localidade;
            campoUf.value = data.uf;

            cepStatus.textContent = "Endereço encontrado!";
            cepStatus.className = "cep-hint sucesso";
          }
        })
        .catch(() => {
          cepStatus.textContent = "Erro ao consultar o CEP.";
          cepStatus.className = "cep-hint erro";
        });
    } else if (cep.length > 0) {
      cepStatus.textContent = "CEP inválido (deve conter 8 dígitos).";
      cepStatus.className = "cep-hint erro";
      limparCamposEndereco();
    }
  });

  function limparCamposEndereco() {
    campoLogradouro.value = "";
    campoBairro.value = "";
    campoCidade.value = "";
    campoUf.value = "";
  }

  // 3. ENVIO DO FORMULÁRIO E EXIBIÇÃO DA MENSAGEM DE AGRADECIMENTO
  formInscricao.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const cidade = campoCidade.value || "sua cidade";

    // Atualiza a mensagem de agradecimento personalizada
    feedbackTexto.innerHTML = `Obrigado por se inscrever, <strong>${nome}</strong>!<br>Enviamos os detalhes do curso para o e-mail <strong>${email}</strong>. Entraremos em contato com a turma de <strong>${cidade}</strong> em breve!`;

    // Oculta o formulário e exibe a box de agradecimento
    formInscricao.classList.add("hidden");
    boxAgradecimento.classList.remove("hidden");
  });

  // REINICIAR FORMULÁRIO
  btnNovoCadastro.addEventListener("click", () => {
    formInscricao.reset();
    limparCamposEndereco();
    cepStatus.textContent = "";
    boxAgradecimento.classList.add("hidden");
    formInscricao.classList.remove("hidden");
  });
});
