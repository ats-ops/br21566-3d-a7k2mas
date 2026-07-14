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

const panel =
    document.getElementById("panel");

const info =
    document.getElementById("info");

const modelSelect =
    document.getElementById("model-select");


// -----------------------------
// 状態
// -----------------------------

let currentSpecimenID = "3593";

let currentSpecimen =
    specimens[currentSpecimenID];

// 現在選択中の部位
let currentPart = null;
// =====================================================
// 標本変更
// =====================================================

function changeModel(id){

    // 標本が存在するか確認
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

    // モデル変更
    viewer.src =
        currentSpecimen.file;

    // ピン削除
    clearAllPins(viewer);

    // 選択状態解除
    clearActiveButton();

    currentPart = null;

    // 標本情報更新
    updateSpecimenInfo(
        currentSpecimen
    );

    // 部位ボタン更新
    createPartButtons(

        panel,

        currentSpecimen,

        showPart

    );

    // 説明を初期状態へ戻す
    showDefaultInfo(info);

}


// =====================================================
// 標本選択イベント
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

        currentPart = null;

        return;

    }

    // 現在の部位
    currentPart = partName;

    // 部位データ取得
    const part =
        getPartData(
            currentSpecimen,
            partName
        );

    if(!part){

        console.warn(
            "部位データがありません:",
            partName
        );

        return;

    }

    // 既存のピン削除
    clearPin();

    // ピン表示
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
// model-viewer エラー
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

    viewer,

    specimens,

    changeModel,

    showPart

};
