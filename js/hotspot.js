// =====================================================
// hotspot.js
// model-viewer Hotspot管理
// =====================================================


let currentPin = null;



// =====================================================
// ピン生成
// =====================================================

export function createPin(viewer, part, callback){


    // 既存ピン削除

    clearPin();



    const pin =
        document.createElement("button");



    pin.className =
        "hotspot";



    pin.slot =
        "hotspot-" + part.name;



    /*
        model-viewerの座標形式

        "x y z"

    */

    pin.dataset.position =
        part.position;



    /*
        ピン方向

        基本は上方向

    */

    pin.dataset.normal =
        "0 1 0";



    pin.dataset.visibilityAttribute =
        "visible";



    pin.innerHTML = `

        <div class="pin-dot"></div>

    `;



    // ピンクリック

    pin.addEventListener(
        "click",
        (event)=>{


            event.stopPropagation();


            if(callback){

                callback(part);

            }


        }
    );



    viewer.appendChild(pin);



    currentPin = pin;


    return pin;


}



// =====================================================
// 現在のピン削除
// =====================================================

export function clearPin(){


    if(currentPin){


        currentPin.remove();


        currentPin = null;


    }


}



// =====================================================
// 全ピン削除
// =====================================================

export function clearAllPins(viewer){


    const pins =
        viewer.querySelectorAll(
            ".hotspot"
        );



    pins.forEach(pin=>{


        pin.remove();


    });



    currentPin = null;


}



// =====================================================
// 現在のピン取得
// =====================================================

export function getCurrentPin(){


    return currentPin;


}



// =====================================================
// ピン表示
// =====================================================

export function showPin(){


    if(currentPin){


        currentPin.style.display =
            "block";


    }


}



// =====================================================
// ピン非表示
// =====================================================

export function hidePin(){


    if(currentPin){


        currentPin.style.display =
            "none";


    }


}



// =====================================================
// ピン位置変更
// =====================================================

export function movePin(position){


    if(currentPin){


        currentPin.dataset.position =
            position;


    }


}