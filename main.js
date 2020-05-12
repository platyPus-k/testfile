// ゲームの時間
const GAME_FPS = 1000/60;

// スクリーンのサイズ
const SCREEN_SIZE_W = 256;
const SCREEN_SIZE_H = 224;

// 仮想画面を有効化
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");

// htmlからidを取得してキャンバス上に描画の有効化
let can = document.getElementById("can");
let con = can.getContext("2d");

// 仮想画面のサイズ
vcan.width = SCREEN_SIZE_W;
vcan.height = SCREEN_SIZE_H;

// キャンバスサイズ指定
can.width = SCREEN_SIZE_W*3;
can.height = SCREEN_SIZE_H*3;

// アップコンバートを無効化
vcon.mozimageSmoothingEnabled    = false;
vcon.webkitimageSmoothingEnabled = false;
vcon.msimageSmoothingEnabled     = false;
vcon.imageSmoothingEnabled       = false;

// フレームレート維持
let frameCount = 0;
let startTime;

// imgオブジェクトを作成してスプライトデータを読み込む　オンロードで起動させる
let chImg = new Image();
chImg.src = "sprite.png";

// 更新処理
function update()
{

}

//　描画処理
function draw()
{
    // 色を指定して四角形を描画
    vcon.fillStyle = "#66AAFF";
    vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);
    vcon.drawImage(chImg,0,0,16,32, 50,15,16,32);

    vcon.fillStyle = "white";
    vcon.fillText("frame"+frameCount,10,10);

    con.drawImage(vcan,0,0,SCREEN_SIZE_W,SCREEN_SIZE_H,
                    0,0,SCREEN_SIZE_W*2,SCREEN_SIZE_H*2);

}

// 秒間60フレーム(1秒間に６０回)でメインループさせる。 
// setInterval(mainLoop,1000/60);
// htmlを読み終えたらオンロード内の処理を実行
window.onload = function()
{
    startTime = performance.now();
    mainLoop();
}

// メインループ処理
function mainLoop()
{
    let nowTime = performance.now();
    let nowFrame = (nowTime-startTime)/GAME_FPS;
    if(nowFrame >  frameCount){
        let c = 0;
        while(nowFrame > frameCount){
            frameCount++;
            // 更新処理
            update();
            if(++c>=4){
                nowTime==frameCount
                break;
            }
        }
        // 描画処理
        draw();
    }
    requestAnimationFrame(mainLoop);
} 
