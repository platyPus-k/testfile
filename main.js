
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
con.mozimageSmoothingEnabled    = false;
con.webkitimageSmoothingEnabled = false;
con.msimageSmoothingEnabled     = false;
con.imageSmoothingEnabled       = false;

// フレームレート維持
let frameCount = 0;
let startTime;

// マップのオブジェクト
let field = new Field();

// マリオのオブジェクト
let ojisan = new Ojisan(100,100);

// ブロックのオブジェクト
let block = [];

// アイテムのオブジェクト
let item = [];

// imgオブジェクトを作成してスプライトデータを読み込む　オンロードで起動させる
let chImg = new Image();
chImg.src = "sprite.png";

// 共通のアップデート
function updateObj(obj)
{
    // スプライトのブロック更新
     for(let i=obj.length-1; i>=0; i--)
     {
         obj[i].update();
         if(obj[i].kill)
         {
            obj.splice(i,1);
         }
     }
}

// 共通の描画
function drawObj(obj)
{
    for(let i=0; i<obj.length; i++)
    {
        obj[i].draw();
    }
}

// 更新処理
function update()
{
    // マップの更新
    field.update();

    //ブロックの更新
    updateObj(block);
    
    // アイテムの更新
    updateObj(item);
    
    // マリオの更新
    ojisan.update();
}

// スプライトを描画
function drawSprite(snum,x,y)
{
    let sx = (snum&15)<<4;
    let sy = (snum>>4)<<4;
    vcon.drawImage(chImg,sx,sy,16,32, x,y,16,32);
}

//　描画処理
function draw()
{
    // 色を指定して四角形(バックスクリーン)を描画
    vcon.fillStyle = "#66AAFF";
    vcon.fillRect(0,0,SCREEN_SIZE_W,SCREEN_SIZE_H);
    //マップの描画
    field.draw();
    // ブロックの描画
    drawObj(block);
    // アイテムの描画
    drawObj(item);
    // マリオの描画
    ojisan.draw();
    
    vcon.fillStyle = "white";
    vcon.fillText("frame"+frameCount,10,10);

    con.drawImage(vcan,0,0,SCREEN_SIZE_W,SCREEN_SIZE_H,
                    0,0,SCREEN_SIZE_W*2,SCREEN_SIZE_H*2);

}

// 秒間60フレーム(1秒間に６０回)でメインループさせる。 
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

// キーボード操作
let key = {};

document.onkeydown = function(e)
{
    if(e.keyCode === 37)key.Left = true;
    if(e.keyCode === 39)key.Right = true;
    if(e.keyCode === 90)key.Abutton = true;
    if(e.keyCode === 88)key.Bbutton = true;
    if(e.keyCode === 65)field.scx--;
    if(e.keyCode === 83)field.scx++;
}   

document.onkeyup = function(e)
{
    if(e.keyCode === 37)key.Left = false;
    if(e.keyCode === 39)key.Right = false;
    if(e.keyCode === 90)key.Abutton = false;
    if(e.keyCode === 88)key.Bbutton = false;
}   
