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

    // for (const bukuItem of daftarBuku) {
    //     const bukuElemen = inputBuku(bukuItem);
    //     console.log(bukuElemen);

    //     if (!bukuItem.isComplete) {
    //         bukuBelumSelesaiDibaca.append(bukuElemen);
    //     } else {
    //         bukuSelesaiDibaca.append(bukuElemen);
    //     }
    // }

    for (let i = 0; i < daftarBuku.length; i++) {
        const bukuItem = daftarBuku[i];
        const bukuElemen = inputBuku(bukuItem);

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
        main.setAttribute('class', 'blur'); // memberikan efek blur pada id main
        container.removeAttribute('class', 'sembunyikan'); // menampilkan container
        deleteDialog.removeAttribute('class', 'sembunyikan'); // menampilkan delete dialog
        buttonYa.addEventListener('click', function () { // jika tombol 'Ya' diklik
            deleteDialog.setAttribute('class', 'sembunyikan'); // menyembunyikan delete dialog
            bukuDihapus.removeAttribute('class', 'sembunyikan'); // menampilkan dialog keterangan buku dihapus
            hapusBuku(bukuObject.id); // menghapus buku
            setTimeout(function () {
                bukuDihapus.setAttribute('class', 'sembunyikan'); // menyembunyikan dialog keterangan buku dihapus
                container.setAttribute('class', 'sembunyikan'); // menyembunyikan container
                main.removeAttribute('class', 'blur'); // menghilangkan efek blur di tag main    
            },5000); // memberikan delay selama 5 detik sebelum dialog keterangan buku dihapus hilang
        });
    
        buttonTidak.addEventListener('click', function () { // jika tombol 'Tidak' diklik
            deleteDialog.setAttribute('class', 'sembunyikan'); // menyembunyikan delete dialog
            container.setAttribute('class', 'sembunyikan'); // menyembunyikan container
            main.removeAttribute('class', 'blur'); // menghilangkan efek blur pada tag main
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

const search = document.getElementById('input-search');
const dataBuku = document.querySelectorAll('.isi');
// const dataJudulBuku1 = inputBuku(bukuObject.title);
const dataJudulBuku2 = document.querySelectorAll('h3');

// console.log(bukuElemen);

search.addEventListener('keyup', function () {
    console.log(search.value.toLowerCase());
    const searchValue = search.value.toLowerCase();
    // let regex = new RegExp(searchValue, 'i');
    // let filtered = daftarBuku.filter(item => regex.test(item));
    // console.log(filtered);

    // let filtered = daftarBuku.filter(buku => buku.includes(searchValue));
    // console.log(filtered);

    document.addEventListener(RENDER_EVENT, function () {
        const search = document.getElementById('input-search');
        const dataBuku = document.querySelectorAll('.isi');
        const dataJudulBuku2 = document.querySelectorAll('h3');
        for (let i = 0; i < daftarBuku.length; i++) {
            const judulBuku = daftarBuku[i].title.toLowerCase();

            const bukuItem = daftarBuku;
            const bukuElemen = inputBuku(bukuItem);
            console.log(bukuElemen);

            if (searchValue == judulBuku) {
                console.log('Hasil = ' + judulBuku);
                dataBuku[i].setAttribute('style', 'display: block;');
            } else {
                dataBuku[i].setAttribute('style', 'display: none;');
            }
        }
    })


    // document.addEventListener(RENDER_EVENT, function () {
    //     for (let i = 0; i < daftarBuku.length; i++) {
    //         const element = daftarBuku[i];
    //         const bukuElemen = inputBuku(element);
    //         console.log(bukuElemen);
    //     }

    // })
});
