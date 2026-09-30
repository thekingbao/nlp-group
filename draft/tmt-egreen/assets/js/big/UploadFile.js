import getImageOfVideo from "../mini/ImageVideo.js";

const optionsDefault = {
    classOneImage: "upload__img-box",
    classOneClose: "upload__img-close",
    attribute: "gallery-of",
    maxFileAttribute: "max-file",
    maxFileSizeAttribute: "max-size",
    defaultMaxFile: Infinity,
    defaultMaxSizeAttribute: 10240000,
};

class UploadFile {
    constructor(options, isLoadFileOld = false) {
        options = { ...optionsDefault, ...options };
        this.check = "element" in options && "attribute" in options;
        if (!this.check) {
            alert("Nhập tên Element chứa Input và Attribute của Gallery");
            return;
        }
        this.nameInput = options.element.dataset.name;
        this.classOneImage = options.classOneImage;
        this.classOneClose = options.classOneClose;
        this.element = options.element;
        this.attribute = options.attribute;
        this.arrayClass = this.element.dataset.class;
        this.oldFiles = [];
        this.oldURL = {};
        this.maxFile =
            this.element.getAttribute(`${options.maxFileAttribute}`) ??
            options.defaultMaxFile;
        this.maxFileSize =
            this.element.getAttribute(`${options.maxFileSizeAttribute}`) ??
            options.defaultMaxSizeAttribute; /* 10 MB */
        this.findPreviewBox();
        this.initInputUpload();
        this.arrayClassClose = [
            this.classOneClose,
            "absolute",
            "top-[8px]",
            "right-[8px]",
            "bg-[rgba(255,255,255,0.5)]",
            "w-[16px]",
            "h-[16px]",
            "flex",
            "justify-center",
            "items-center",
            "cursor-pointer",
            "hover:bg-orange-500",
            "hover:[path:white]",
            "shadow-sm",
            "hover:shadow-md",
            "transition-all",
            "duration-300",
            "rounded-sm",
        ];
        if (isLoadFileOld) {
            this.pushFileOld();
        }
    }

    findPreviewBox = () => {
        this.uploadImageInput = document.querySelector(
            `input[name="${this.nameInput}[]"]`
        );
        this.previewImageBox = document.querySelector(
            `[ ${this.attribute}="${this.uploadImageInput.name.replace(
                "[]",
                ""
            )}"]`
        );
        this.listImage = this.previewImageBox.getElementsByClassName(
            this.classOneImage
        );
    };

    initInputUpload = () => {
        if (!this.uploadImageInput) return;
        this.uploadImageInput.addEventListener("change", async (event) => {
            var files = Array.from(event.target.files);
            var filesArr = [];
            for (const file of files) {
                this.validateFileUpload(file, files) && filesArr.push(file);
            }
            var fileBuffer = new DataTransfer();
            [...Array.from(this.oldFiles), ...filesArr].forEach((file) =>
                fileBuffer.items.add(file)
            );
            var fileFinals = fileBuffer.files;
            this.uploadImageInput.files = fileFinals;
            this.oldFiles = fileFinals;
            this.updateFileList(filesArr);
        });
    };

    validateFileUpload = (file, files) => {
        if (Array.from(this.oldFiles).length + files.length > this.maxFile) {
            console.log(`Đã vượt qua số lượng file tối đa ${this.maxFile}!`);
            return false;
        }

        // if (!["image.*", "video.*"].some((type) => file.type.match(type))) {
        //     console.log("File không đúng định dạng Ảnh hoặc Video");
        //     return false;
        // }

        if (file.size > this.maxFileSize) {
            console.log(
                `Tệp ${file.name}: ${this.humanFileSize(
                    file.size
                )} đã vượt quá dung lượng tối đa ${this.humanFileSize(
                    this.maxFileSize
                )}!`
            );
            return false;
        }

        if (!Array.from(this.oldFiles).some((item) => item.name == file.name)) {
            return true;
        }
        return false;
    };
    infoFile = (file) => {
        let name = file.name;
        const extention = name.split(".").pop();
        const nameShow =
            name.length > 15
                ? `${name.replace(extention, "").slice(0, 15)}... ${extention}`
                : name;
        const size = this.humanFileSize(file.size);
        return { name, nameShow, extention, size };
    };
    updateFileList = async (files) => {
        var filesArr = Array.from(files);
        for await (const file of filesArr) {
            let image;
            let { name, nameShow, extention, size } = this.infoFile(file);
            if (!["image.*", "video.*"].some((type) => file.type.match(type))) {
                image = "/admin/images/ext/" + extention + ".png";
            } else {
                image = window.URL.createObjectURL(file);
            }

            if (file.type.match("video.*")) {
                image = new getImageOfVideo(image, 1, this.videoUpload, [file]);
                image.init();
                continue;
            }

            const elementImagePreview = document.createElement("div");
            elementImagePreview.classList.add(
                this.classOneImage,
                ...this.arrayClass
            );
            elementImagePreview.innerHTML = this.template(
                name,
                nameShow,
                image,
                size
            );

            const elementRemovePreview = document.createElement("div");
            elementRemovePreview.className = this.arrayClassClose.join(" ");
            elementRemovePreview.innerHTML = `x`;
            elementRemovePreview.setAttribute("data-file", file.name);
            elementRemovePreview.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.removeFile(file.name, file.size, file.lastModified);
                window.URL.revokeObjectURL(
                    elementRemovePreview.closest(".img-bg").querySelector("img")
                        .src
                );
                elementRemovePreview.closest(`.${this.classOneImage}`).remove();
                this.sortList();
            });
            elementImagePreview
                .querySelector(".img-bg")
                .appendChild(elementRemovePreview);
            if (this.previewImageBox) {
                if (!this.element.hasAttribute("has-file")) {
                    this.element.setAttribute("has-file", true);
                }
                this.previewImageBox.appendChild(elementImagePreview);
            }
        }
        await this.onDragable();
        await this.sortList();
    };

    template = (name, nameShow, image, size) => {
        return `<div class="img-bg col-span-1 relative rounded-md shadow-md cursor-move border">
                <div class="h-[80px] w-full">
                    <img class="w-full h-full object-contain" src="${image}" title="${nameShow}" >
                </div>
                <p title="${name}" class="p-1 text-[10px] bg-orange-400 text-white">${nameShow} - ${size}</p>
            </div>`;
    };
    pushFileOld = async () => {
        var fileBuffer = new DataTransfer();
        for await (const box of this.listImage) {
            const img = box.querySelector("img");
            const file = this.dataURLtoFile(img.src, img.title);
            fileBuffer.items.add(file);
            const deleteEl = box.querySelector(`${this.classOneClose}`);
            deleteEl.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.removeFile(file.name, file.size, file.lastModified);
                box.remove();
                this.sortList();
            });
        }
        this.oldFiles = fileBuffer.files;
        this.uploadImageInput.files = this.oldFiles;
        return true;
    };

    videoUpload = (image, file) => {
        let { name, nameShow, extention, size } = this.infoFile(file);

        const elementImagePreview = document.createElement("div");
        elementImagePreview.classList.add(
            "upload__img-box",
            "relative",
            ...this.arrayClass
        );
        elementImagePreview.innerHTML = this.template(
            name,
            nameShow,
            image,
            size
        );

        const elementRemovePreview = document.createElement("div");
        elementRemovePreview.className = this.arrayClassClose.join(" ");
        elementRemovePreview.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        elementRemovePreview.setAttribute("data-file", file.name);
        elementRemovePreview.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.removeFile(file.name, file.size, file.lastModified);
            elementRemovePreview.closest(".upload__img-box").remove();
        });

        const elementPreviewVideo = document.createElement("div");
        elementPreviewVideo.className = [
            "update__img-preview",
            "absolute",
            "top-[50%]",
            "left-[50%]",
            "translate-x-[-50%]",
            "translate-y-[-50%]",
        ].join(" ");
        elementPreviewVideo.innerHTML = `<i class="text-white fa-solid fa-play"></i>`;

        elementPreviewVideo.addEventListener("click", (e) => {
            e.preventDefault();
            const video = document.createElement("video");
            video.src = window.URL.createObjectURL(file);
        });

        elementImagePreview
            .querySelector(".img-bg")
            .appendChild(elementRemovePreview);
        elementImagePreview.appendChild(elementPreviewVideo);
        if (this.previewImageBox) {
            if (!this.element.hasAttribute("has-file")) {
                this.element.setAttribute("has-file", true);
            }
            this.previewImageBox.appendChild(elementImagePreview);
        }
        this.onDragable();
        this.sortList();
    };

    removeFile = async (name, size, lastModified) => {
        var fileBuffer = new DataTransfer();
        Array.from(this.uploadImageInput.files)
            .filter(
                (item) =>
                    item.name != name &&
                    item.size != size &&
                    item.lastModified != lastModified
            )
            .forEach((file) => fileBuffer.items.add(file));
        this.uploadImageInput.files = fileBuffer.files;
        this.oldFiles = fileBuffer.files;
        if (
            this.uploadImageInput.files.length == 0 &&
            this.element.hasAttribute("has-file")
        ) {
            this.element.removeAttribute("has-file");
        }
    };

    sortList = async () => {
        [this.previewImageBox, this.listImage] = this.getBoxAndListImage();
        for (var i = 0; i < this.listImage.length; i++) {
            this.listImage[i].setAttribute("data-sort", i);
        }
    };

    getBoxAndListImage = () => {
        const box = document.querySelector(
            `[ ${this.attribute}="${this.uploadImageInput.name.replace(
                "[]",
                ""
            )}"]`
        );

        const list = box.querySelectorAll(`.${this.classOneImage}`);

        return [box, list];
    };
    onDragable = async () => {
        this.previewImageBox = document.querySelector(
            `[ ${this.attribute}="${this.uploadImageInput.name.replace(
                "[]",
                ""
            )}"]`
        );
        this.listImage = this.previewImageBox.querySelectorAll(
            `.${this.classOneImage}`
        );
        for (const item of this.listImage) {
            item.draggable = true;
            item.addEventListener("dragstart", (event) =>
                this.dragStart(event)
            );
            item.addEventListener("dragend", (event) => this.dragEnd(event));
            item.addEventListener("dragover", (event) => this.dragOver(event));
            item.addEventListener("drop", (event) => this.dragDrop(event));
        }
    };

    dragOver = (event) => {
        event.preventDefault();
        if (event.target != this.fileDrag && this.fileDrag != undefined) {
            const calculator =
                event.clientX /
                    event.target.closest(`.${this.classOneImage}`).offsetWidth -
                Math.floor(
                    event.clientX /
                        event.target.closest(`.${this.classOneImage}`)
                            .offsetWidth
                );
            if (calculator < 0.5) {
                event.target
                    .closest(`.${this.classOneImage}`)
                    .parentNode.insertBefore(
                        this.fileDrag,
                        event.target.closest(`.${this.classOneImage}`)
                    );
            } else {
                event.target
                    .closest(`.${this.classOneImage}`)
                    .parentNode.insertBefore(
                        this.fileDrag,
                        event.target.closest(`.${this.classOneImage}`)
                            .nextSibling
                    );
            }
        }
        this.sortOrDelete();
    };

    dragDrop = (event) => {
        event.preventDefault();
    };

    sortOrDelete = () => {
        this.previewImageBox = document.querySelector(
            `[ ${this.attribute}="${this.uploadImageInput.name.replace(
                "[]",
                ""
            )}"]`
        );
        this.listImage = this.previewImageBox.querySelectorAll(
            `.${this.classOneImage}`
        );

        const arraySort = Array.from(this.listImage).map((item) =>
            item.getAttribute("data-sort")
        );
        //Tạo lại mảng file sắp xếp theo thứ tự vừa di chuyển
        const files = arraySort.reduce((files, current) => {
            files.push(this.uploadImageInput.files[current]);
            return files;
        }, []);
        var fileBuffer = new DataTransfer();
        files.forEach((file) => fileBuffer.items.add(file));
        this.uploadImageInput.files = fileBuffer.files;
        this.oldFiles = fileBuffer.files;
        // Sắp xếp lại mảng file cho đúng thứ tự
        this.sortList();
    };

    dragStart = (event) => {
        this.fileDrag = event.target.classList.contains(this.classOneImage)
            ? event.target
            : event.target.closest(`.${this.classOneImage}`);
        const image = this.fileDrag.getBoundingClientRect();
        this.width = image.width;
        this.height = image.height;
        this.fileDrag.classList.add("dragging");
    };

    dragEnd = (event) => {
        this.fileDrag?.classList?.remove("dragging");
        this.fileDrag = null;
    };

    humanFileSize = (B, i = true) => {
        var e = i ? 1e3 : 1024;
        if (Math.abs(B) < e) return B + " B";
        var a = i
                ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
                : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
            t = -1;
        do (B /= e), ++t;
        while (Math.abs(B) >= e && t < a.length - 1);
        return B.toFixed(1) + " " + a[t];
    };

    dataURLtoFile = (base64, filename) => {
        var arr = base64.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, {
            type: mime,
        });
    };
}

export default UploadFile;
