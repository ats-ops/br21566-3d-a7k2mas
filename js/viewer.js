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




// =====================================================
// 標本変更
// =====================================================

// =====================================================
// 標本変更
// =====================================================

function changeModel(id){

    if(!specimens[id]){

        console.error(
            "標本がありません:",
            id
        );

        return;

    }

    // 現在の標本更新
    currentSpecimenID = id;

    currentSpecimen =
        specimens[id];

    // モデル変更
    viewer.src =
        currentSpecimen.file;

    // ピン削除
    clearAllPins(viewer);

    // ボタン選択解除
    clearActiveButton();

    // 選択部位解除
    currentPart = null;

    // 標本情報更新
    updateSpecimenInfo(
        currentSpecimen
    );

    // 部位ボタン再生成
    createPartButtons(
        panel,
        currentSpecimen,
        showPart
    );

    // 説明を初期状態に戻す
    showDefaultInfo(info);

    // 比較パネル初期化
    const compare =
        document.getElementById("compare-content");

    if(compare){

        compare.innerHTML =
            "部位を選択してください。";

    }

}

// =====================================================
// 部位選択
// =====================================================

// 現在選択中の部位
let currentPart = null;

function showPart(partName){

    // 同じ部位を押したら解除
    if(currentPart === partName){

        clearPin();

        clearActiveButton();

        showDefaultInfo(info);

        document.getElementById("compare-content").innerHTML =
            "部位を選択してください。";

        currentPart = null;

        return;
    }

    currentPart = partName;

    const part = getPartData(currentSpecimen, partName);

    if(!part){
        return;
    }

    // ピン表示
    createPin(
        viewer,
        part,
        (selectedPart)=>{
            showDescription(info, selectedPart);
        }
    );

    // 説明表示
    showDescription(info, part);

    // 比較表示
    showCompare(partName);
}


// =====================================================
// 比較表示
// =====================================================

function showCompare(partName){

    const compare =
        document.getElementById("compare-content");

    const brown =
        specimens["3593"].parts[partName];

    const black =
        specimens["4127"].parts[partName];

    compare.innerHTML = `

        <h3>${partName}</h3>

        <h4>ヒグマ（3593）</h4>

        <p>${brown.text}</p>

        <hr>

        <h4>ツキノワグマ（4127）</h4>

        <p>${black.text}</p>

    `;
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
            "GLBモデルを読み込めませんでした"
        );


    }

);




// =====================================================
// モデル選択UI
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
// 初期化
// =====================================================

function initialize(){



    updateSpecimenInfo(

        currentSpecimen

    );



    createPartButtons(

        panel,

        currentSpecimen,

        showPart

    );



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



// デバッグ用

window.viewerApp = {

    changeModel,

    showPart,

    specimens

};
