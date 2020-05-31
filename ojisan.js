
// おじさんクラス

const ANIME_JUMP  = 8; 
const ANIME_BRAKE = 4; 
const ANIME_WALK  = 2; 
const ANIME_STAND = 1; 
const GRAVITY = 4;

const TYPE_MINI = 1;
const TYPE_BIG  = 2;
const TYPE_FIRE = 4;

class Ojisan
{
    constructor(x,y)
    {
        this.x = x<<4;
        this.y = y<<4;
        this.w = 16;
        this.h = 16; 
        this.vx= 0;
        this.vy= 0;
        this.anime= 0;
        this.acount=0;
        this.dir= 0;
        this.jump= 0;
        this.snum = 0;

        this.kinoko = 0;
        this.type = TYPE_MINI;
    }

    //　床の当たり判定
    checkFloor()
    {
        if(this.vy<0)return;
        let lx = (this.x>>4);
        let ly = ((this.y+this.vy)>>4);
        let p = TYPE_MINI?3:0;

        if( field.isBlock(lx+1+p,ly+31) ||
            field.isBlock(lx+14-p,ly+31) )
        {
            if(this.anime === ANIME_JUMP)this.anime==ANIME_WALK;

            this.jump = 0;
            this.vy = 0;
            this.y = (((((ly+31)>>4)<<4)-32)<<4);
        }
       
    }
    // 左右の当たり判定
    checkWall()
    {
        let lx = ((this.x+this.vx)>>4);
        let ly = ((this.y+this.vy)>>4);
        let p = (this.type==TYPE_MINI?16+8:2)
        if( field.isBlock(lx+15,ly+p) ||
            (this.type!==TYPE_MINI)&& (
            field.isBlock(lx+15,ly+15)||
            field.isBlock(lx+15,ly+29)))
        {
            this.vx = 0;
        } else 
        if( field.isBlock(lx,ly+p) ||
           (this.type!==TYPE_MINI)&&(
            field.isBlock(lx,ly+15)||
            field.isBlock(lx,ly+29)))
        {
            this.vx = 0;
        }
    }
    // 天井の当たり判定
    checkCeil()
    {
        if(this.vy>=0)return;
        let lx = ((this.x+this.vx)>>4);
        let ly = ((this.y+this.vy)>>4);
        let ly2 = ly+ (this.type==TYPE_MINI?16:0)
        let bl;
        if( bl=field.isBlock(lx+8,ly2) )
        {
            this.jump = 20;
            this.vy = 0;
            let x = (lx+8)>>4;
            let y = ly2>>4;
            
            let raR1 = (Math.random(6,8)*100)*(-1);
            let raR2 = (Math.random(6,7)*100)*(-1);
            let raR3 = (Math.random(6,8)*100)*(-1);
            let raR4 = (Math.random(6,7)*100)*(-1);

            if(bl!=371 && bl!=368 && bl!=369 && bl!=370){
                block.push(new Block(bl,x,y ) );
            } else if(bl==371 && this.type==TYPE_BIG) {
                block.push(new Block(bl,x,y,1,-20,raR1));
                block.push(new Block(bl,x,y,1,20,raR2));
                block.push(new Block(bl,x,y,1,-20,raR3));
                block.push(new Block(bl,x,y,1,20,raR4));
            } else if(bl==368 || bl==369 ) {
                item.push(new Item(218,x,y,0,0 ) );
                block.push(new Block( 370,x,y ) );
            } else if(this.type==TYPE_MINI && bl==371) {
                block.push(new Block(bl,x,y ) );
            }
        }
    }

    // 毎フレームごとのジャンプ処理
    updateJump()
    {
        if(key.Abutton)
        {  
            this.anime = ANIME_JUMP;
            if(this.jump==0)
            {
                this.jump = 1;
                this.vy = -32;
            }
            else if(this.jump)
            {
                this.jump++;
            }
            if(this.jump<10){ this.vy = -64-this.jump; }
        }
    }

    // 左右の横移動
    updateWalkSub(dir)
    {
        this.dir = dir;
        // 最高速まで加速
        if(this.dir==0  && this.vx<32) this.vx += 2;
        if(this.dir==1  && this.vx>-32)this.vx -= 2;
        
        if(!this.jump)
        {
            // ジャンプをしていない時
            this.anime = ANIME_WALK;
            if(this.vx<-8 && dir==0) this.anime = ANIME_BRAKE;
            if(this.vx>8 && dir==1)  this.anime = ANIME_BRAKE;
            if(this.vx<0 && dir==0) this.vx++;
            if(this.vx>0 && dir==1) this.vx--;
            
        }
    }
    // 毎フレームごとの移動処理
    updateWalk()
    {
        if(key.Right){ this.updateWalkSub(0); }
        if(key.Left) { this.updateWalkSub(1); }
        if(!key.Left && key.Right 
        || key.Left && !key.Right
        || !key.Left && !key.Right)
        {
            if     (!key.Right && this.vx>0)this.vx-=1; 
            else if(!key.Left && this.vx<0)this.vx+=1;
            else if(this.vx==0 && this.vy==0) this.anime=ANIME_STAND;
        }
    }
    // 毎フレームごとのアニメ処理
    updateAnime()
    {
        switch(this.anime)
        {
            case ANIME_STAND:
                this.snum = 0;
                break;
            case ANIME_WALK:
                this.snum = 2 + ((this.acount/8)%3);
                break;
            case ANIME_JUMP:
                this.snum = 6;
                break;
            case ANIME_BRAKE:
                this.snum = 5;
                break;
        }
        // ちっちゃいおじさんの時
        if(this.type==TYPE_MINI)this.snum += 32;
        // 左向きの時のスプライト
        if(this.dir==1)this.snum += 48;
    }
    // 毎フレームごとの更新処理
    update()
    {
        // キノコを取った時のエフェクト
        if(this.kinoko)
        {
            let anime = [32,14,32,14,32,14,0,32,14,0];
            this.snum = anime [this.kinoko>>2];
            this.h = this.snum==32?16:32;
            if(++this.kinoko == 40)
            {
                this.kinoko=0;
                this.type=TYPE_BIG;
            }

            return;
        }
        // アニメ用のカウント
        this.acount++;
        if(Math.abs(this.vx)==32)this.acount++;

        // マリオの動きのアップデート処理
        this.updateWalk();
        this.updateJump();
        this.updateAnime();

        // 重力
        if(this.vy<64)this.vy += GRAVITY;
        
         // 当たり判定
         this.checkFloor();
         this.checkWall();
         this.checkCeil();

        // ベクトル(移動量)の追加
        this.x += this.vx;
        this.y += this.vy;
    }
    // 毎フレームごとの描画処理
    draw()
    {
        let px = (this.x>>4) - field.scx;
        let py = (this.y>>4) - field.scy;
        let sx = (this.snum&15)<<4;
        let sy = (this.snum>>4)<<4;

        let w = this.w;
        let h = this.h;
        py += (32-h);
        vcon.drawImage(chImg,sx,sy,w,h, px,py,w,h);
    }
}