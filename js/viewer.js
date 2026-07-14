// =====================================================
// viewer.js
// 3D標本ビューア メイン制御
// =====================================================


// -----------------------------
// Import
// -----------------------------

import { specimens }
from "./config/index.js";

import {

    updateSpecimenInfo,
    createPartButtons,
    showDescription,
    showDefaultInfo,
    getPartData,
    clearActiveButton

} from "./ui.js";

import {

    createPin,
    clearPin,
    clearAllPins

} from "./hotspot.js";


// -----------------------------
// DOM取得
// -----------------------------

const viewer =
    document.getElementById("viewer");

const previewViewer =
    document.getElementById("preview-viewer");

const panel =
    document.getElementById("panel");

const info =
    document.getElementById("info");

const modelSelect =
    document.getElementById("model-select");

const compareContent =
    document.getElementById("compare-content");


// -----------------------------
// 状態
// -----------------------------

let currentSpecimenID = "3593";

let currentSpecimen =
    specimens[currentSpecimenID];

let currentPart = null;


// =====================================================
// 比較モデル更新
// =====================================================

function updatePreviewModel(){

    if(!previewViewer){

        return;

    }

    if(currentSpecimenID === "3593"){

        previewViewer.src =
            specimens["4127"].file;

    }
    else{

        previewViewer.src =
            specimens["3593"].file;

    }

}
// =====================================================
// 標本変更
// =====================================================

function changeModel(id){

    // 存在確認
    if(!specimens[id]){

        console.error(
            "標本がありません:",
            id
        );

        return;

    }

    // 現在の標本を更新
    currentSpecimenID = id;

    currentSpecimen =
        specimens[id];

    // メインモデル変更
    viewer.src =
        currentSpecimen.file;

    // 比較モデル更新
    updatePreviewModel();

    // ピン削除
    clearAllPins(viewer);

    // 選択解除
    clearActiveButton();

    currentPart = null;

    // 標本情報更新
    updateSpecimenInfo(
        currentSpecimen
    );

    // 部位ボタン生成
    createPartButtons(

        panel,

        currentSpecimen,

        showPart

    );

    // 説明を初期状態へ
    showDefaultInfo(info);

    // 比較説明を初期状態へ
    if(compareContent){

        compareContent.innerHTML = `
            部位を選択すると、
            比較標本が表示されます。
        `;

    }

}


// =====================================================
// モデル選択
// =====================================================

if(modelSelect){

    modelSelect.addEventListener(

        "change",

        (event)=>{

            changeModel(
                event.target.value
            );

        }

    );

}
// =====================================================
// 部位選択
// =====================================================

function showPart(partName){

    // 同じ部位を押したら解除
    if(currentPart === partName){

        clearPin();

        clearActiveButton();

        showDefaultInfo(info);

        if(compareContent){

            compareContent.innerHTML =
                "部位を選択してください。";

        }

        currentPart = null;

        return;

    }

    currentPart = partName;

    const part =
        getPartData(
            currentSpecimen,
            partName
        );

    if(!part){

        return;

    }

    // メインモデルにピン表示
    createPin(

        viewer,

        part,

        (selectedPart)=>{

            showDescription(
                info,
                selectedPart
            );

        }

    );

    // 説明表示
    showDescription(
        info,
        part
    );



    // ==========================
    // 比較モデル更新
    // ==========================

    const compareID =
        currentSpecimenID === "3593"
            ? "4127"
            : "3593";

    const comparePart =
        specimens[compareID].parts[partName];

    if(previewViewer){

        previewViewer.src =
            specimens[compareID].file;

        if(comparePart){

            if(comparePart.orbit){

                previewViewer.cameraOrbit =
                    comparePart.orbit;

            }

            if(comparePart.target){

                previewViewer.cameraTarget =
                    comparePart.target;

            }

        }

    }



    // ==========================
    // 比較説明
    // ==========================

    if(compareContent){

        compareContent.innerHTML = `

            <h3>${partName}</h3>

            <h4>${currentSpecimen.name}</h4>

            <p>${part.text}</p>

            <hr>

            <h4>${specimens[compareID].name}</h4>

            <p>

                ${
                    comparePart
                        ? comparePart.text
                        : "この部位のデータはありません。"
                }

            </p>

        `;

    }

}
// =====================================================
// model-viewer 読込完了
// =====================================================

viewer.addEventListener(

    "load",

    ()=>{

        console.log(
            "3Dモデル読み込み完了"
        );

    }

);


// =====================================================
// エラー
// =====================================================

viewer.addEventListener(

    "error",

    ()=>{

        alert(
            "GLBモデルを読み込めませんでした。"
        );

    }

);


// =====================================================
// 初期化
// =====================================================

function initialize(){

    // 標本情報
    updateSpecimenInfo(

        currentSpecimen

    );

    // 部位ボタン生成
    createPartButtons(

        panel,

        currentSpecimen,

        showPart

    );

    // 説明初期化
    showDefaultInfo(

        info

    );

    // 比較モデル表示
    updatePreviewModel();

    // 比較説明初期化
    if(compareContent){

        compareContent.innerHTML =

            "部位を選択すると比較標本が表示されます。";

    }

    console.log(

        "Viewer Initialized"

    );

}


// =====================================================
// 起動
// =====================================================

window.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initialize();

    }

);


// =====================================================
// デバッグ用
// =====================================================

window.viewerApp = {

    changeModel,

    showPart,

    specimens,

    viewer,

    previewViewer

};
