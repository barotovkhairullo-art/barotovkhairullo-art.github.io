const files = {
  "cv-pdf": {
    name: "CV Khairullo Barotov.pdf",
    type: "application/pdf",
    parts: ["00", "01", "02", "03", "04"].map(n => `assets/archive/cv-pdf/part-${n}`)
  },
  "cv-docx": {
    name: "CV Khairullo Barotov.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    parts: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"].map(n => `assets/archive/cv-docx/part-${n}`)
  }
};

const params = new URLSearchParams(location.search);
const item = files[params.get("file")];
const title = document.querySelector("#title");
const status = document.querySelector("#status");
const progress = document.querySelector("#progress");
const button = document.querySelector("#download");
const viewer = document.querySelector("#viewer");

async function assemble() {
  if (!item) throw new Error("Файл не найден");
  title.textContent = item.name;
  const chunks = [];
  for (let i = 0; i < item.parts.length; i++) {
    const response = await fetch(item.parts[i]);
    if (!response.ok) throw new Error("Не удалось загрузить часть файла");
    chunks.push(await response.arrayBuffer());
    progress.style.width = `${((i + 1) / item.parts.length) * 100}%`;
    status.textContent = `Загружено ${i + 1} из ${item.parts.length}`;
  }
  const url = URL.createObjectURL(new Blob(chunks, { type: item.type }));
  button.style.display = "inline-block";
  button.onclick = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = item.name;
    link.click();
  };
  if (params.get("open") === "1" && item.type === "application/pdf") {
    viewer.src = url;
    viewer.style.display = "block";
    status.textContent = "Документ готов";
  } else {
    status.textContent = "Файл готов к скачиванию";
    button.click();
  }
}

assemble().catch(error => {
  title.textContent = "Ошибка";
  status.textContent = error.message;
  status.classList.add("error");
});
