const daftarBuku = [];
const RENDER_EVENT = 'render-buku';
const SAVED_EVENT = 'saved-buku';
const STORAGE_KEY = 'BOOKSHELF-APPS';

document.addEventListener('DOMContentLoaded', function () {
    const buttonBelumSelesai = document.getElementById('submitBelumSelesaiDibaca');
    const buttonSelesai = document.getElementById('submitSelesaiDibaca');

    buttonBelumSelesai.addEventListener('click', function (event) {
        event.preventDefault();
        tambahBuku(false);
    });

    buttonSelesai.addEventListener('click', function (event) {
        event.preventDefault();
        tambahBuku(true);
    });

    if (storageTersedia()) {
        loadDataDariStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    console.log(daftarBuku);
    const bukuBelumSelesaiDibaca = document.getElementById('daftarBukuBelumSelesaiDibaca');
    bukuBelumSelesaiDibaca.innerHTML = '';

    const bukuSelesaiDibaca = document.getElementById('daftarBukuSelesaiDibaca');
    bukuSelesaiDibaca.innerHTML = '';

    for (const bukuItem of daftarBuku) {
        const bukuElemen = inputBuku(bukuItem);
        console.log(bukuElemen);

        if (!bukuItem.isComplete) {
            bukuBelumSelesaiDibaca.append(bukuElemen);
        } else {
            bukuSelesaiDibaca.append(bukuElemen);
        }
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function generateBukuObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function storageTersedia() {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (storageTersedia()) {
        const parsed = JSON.stringify(daftarBuku);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function tambahBuku(baca) {
    const judulBuku = document.getElementById('inputJudul').value;
    const penulisBuku = document.getElementById('inputPenulis').value;
    const tahunTerbit = document.getElementById('inputTahun').value;

    const generateID = generateId();
    const bukuObject = generateBukuObject(generateID, judulBuku, penulisBuku, tahunTerbit, baca);

    daftarBuku.push(bukuObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();

    return baca;
}

function generateId() {
    return +new Date();
}

function inputBuku(bukuObject) {
    const textJudul = document.createElement('h3');
    textJudul.innerText = bukuObject.title;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = 'Penulis : ' + bukuObject.author;

    const textTahun = document.createElement('p');
    textTahun.innerText = 'Tahun terbit : ' + bukuObject.year;

    const deleteButtonIcon = document.createElement('span');
    deleteButtonIcon.setAttribute('class', 'material-symbols-outlined');
    deleteButtonIcon.innerText = 'delete';

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'hapus');
    deleteButton.setAttribute('title', 'Hapus buku');
    deleteButton.append(deleteButtonIcon);

    const container = document.getElementById('container');
    const deleteDialog = document.getElementById('delete-dialog');
    const bukuDihapus = document.getElementById('buku-dihapus');
    const buttonYa = document.getElementById('ya');
    const buttonTidak = document.getElementById('tidak');
    const main = document.getElementById('main');

    // saat tombol delete diklik
    deleteButton.addEventListener('click', function () {
        main.setAttribute('class', 'blur');
        container.removeAttribute('class', 'sembunyikan');
        deleteDialog.removeAttribute('class', 'sembunyikan');
        buttonYa.addEventListener('click', function () {
            deleteDialog.setAttribute('class', 'sembunyikan');
            bukuDihapus.removeAttribute('class', 'sembunyikan');
            hapusBuku(bukuObject.id);
            setTimeout(function () {
                bukuDihapus.setAttribute('class', 'sembunyikan');
                container.setAttribute('class', 'sembunyikan');
                main.removeAttribute('class', 'blur');
            }, 3000);
        });

        buttonTidak.addEventListener('click', function () {
            deleteDialog.setAttribute('class', 'sembunyikan');
            container.setAttribute('class', 'sembunyikan');
            main.removeAttribute('class', 'blur');
        });
    });

    const buttons = document.createElement('div');
    buttons.setAttribute('class', 'buttons');

    const isi = document.createElement('div');
    isi.setAttribute('class', 'isi');
    isi.setAttribute('id', `buku-${bukuObject.id}`);

    if (bukuObject.isComplete) {
        const cancelButtonIcon = document.createElement('span');
        cancelButtonIcon.setAttribute('class', 'material-symbols-outlined');
        cancelButtonIcon.innerText = 'cancel';

        const cancelButton = document.createElement('button');
        cancelButton.setAttribute('class', 'tandaiBelumDibaca');
        cancelButton.setAttribute('title', 'Tandai belum dibaca');
        cancelButton.append(cancelButtonIcon);

        cancelButton.addEventListener('click', function () {
            tandaiBukuBelumDibaca(bukuObject.id);
        });

        buttons.append(cancelButton, deleteButton);
    }
    else {
        const checkButtonIcon = document.createElement('span');
        checkButtonIcon.setAttribute('class', 'material-symbols-outlined');
        checkButtonIcon.innerText = 'check_circle';

        const checkButton = document.createElement('button');
        checkButton.setAttribute('class', 'tandaiSelesaiDibaca');
        checkButton.setAttribute('title', 'Tandai selesai dibaca');
        checkButton.append(checkButtonIcon);

        checkButton.addEventListener('click', function () {
            tandaiBukuSelesaiDibaca(bukuObject.id);
        })

        buttons.append(checkButton, deleteButton);
    }

    isi.append(textJudul, textPenulis, textTahun, buttons);

    return isi;
}

function cariBuku(bukuId) {
    for (const bukuItem of daftarBuku) {
        if (bukuItem.id === bukuId) {
            return bukuItem;
        }
    }
    return null;
}

function cariBukuIndex(bukuId) {
    for (const index in daftarBuku) {
        if (daftarBuku[index].id === bukuId) {
            return index;
        }
    }

    return -1;
}

function tandaiBukuSelesaiDibaca(bukuId) {
    const bukuTarget = cariBuku(bukuId);

    if (bukuTarget == null) {
        return;
    }

    bukuTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function tandaiBukuBelumDibaca(bukuId) {
    const bukuTarget = cariBuku(bukuId);

    if (bukuTarget == null) {
        return;
    }

    bukuTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function hapusBuku(bukuId) {
    const bukuTarget = cariBukuIndex(bukuId);

    if (bukuTarget === -1) {
        return;
    }

    daftarBuku.splice(bukuTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function loadDataDariStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const buku of data) {
            daftarBuku.push(buku);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}