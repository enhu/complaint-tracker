# 瀹㈣瘔缁熻宸ュ叿 - 浜戠鍏变韩鐗?
**鎵€鏈変汉鎵撳紑鍚屼竴涓摼鎺ワ紝鏁版嵁瀹炴椂鍏变韩銆?*

## 鍔熻兘

- 馃摑 宸ュ崟褰曞叆锛?3涓瓧娈碉紝鏀寔闂ㄥ簵/鍟嗗搧鑱旀兂杈撳叆
- 馃搵 瀹㈣瘔鏄庣粏锛氭棩鏈熺瓫閫夈€佺紪杈戙€佸垹闄ゃ€丆SV瀵煎叆瀵煎嚭
- 馃搳 闂鍒嗘瀽锛?涓浘琛?+ 闂ㄥ簵/鍟嗗搧鏄庣粏琛?+ 鐢熸垚鍒嗕韩鎶ュ憡
- 馃懃 澶氫汉鍏变韩锛氫簯绔瓨鍌紝鎵€鏈変汉瀹炴椂鍚屾
- 馃懁 澶勭悊瀹㈡湇锛氭儬/钄?濠?鏋?绮?鍏朵粬瀹㈡湇

## 蹇€熷紑濮?
```bash
npm install
npm start
# 鎵撳紑 http://localhost:3000
```

## 閮ㄧ讲鍒?Railway锛堝厤璐癸級

### 姝ラ 1锛氬噯澶?GitHub 浠撳簱

```bash
cd complaint-tracker
git init
git add .
git commit -m "init"
git remote add origin https://github.com/浣犵殑鐢ㄦ埛鍚?complaint-tracker.git
git push -u origin main
```

### 姝ラ 2锛氬湪 Railway 閮ㄧ讲

1. 鎵撳紑 [railway.app](https://railway.app)锛岀敤 GitHub 鐧诲綍
2. 鐐瑰嚮 **New Project** 鈫?**Deploy from GitHub repo**
3. 閫夋嫨 `complaint-tracker` 浠撳簱
4. Railway 鑷姩妫€娴?Node.js 椤圭洰骞堕儴缃?
### 姝ラ 3锛氶厤缃寔涔呭嵎锛堥噸瑕侊紒锛?
1. 鍦ㄩ」鐩缃腑鎵惧埌 **Volumes** 閫夐」鍗?2. 鐐瑰嚮 **Add Volume**
3. 鎸傝浇璺緞濉啓锛歚/data`
4. 澶у皬锛?.5 GB 澶熺敤

### 姝ラ 4锛氳缃幆澧冨彉閲?
鍦ㄩ」鐩缃殑 **Variables** 涓坊鍔狅細

```
DATA_DIR=/data
```

### 姝ラ 5锛氳幏鍙栭摼鎺?
閮ㄧ讲瀹屾垚鍚庝綘浼氬緱鍒颁竴涓摼鎺ワ紝濡傦細

```
https://complaint-tracker.up.railway.app
```

鎶婅繖涓摼鎺ュ彂鍒板井淇＄兢锛?浣嶅鏈?+ 涓荤鍏辩敤鍚屼竴涓摼鎺ワ紒

## 鏁版嵁璇存槑

- 鏁版嵁瀛樺偍鍦?Railway 鎸佷箙鍗?`/data/tickets.json`
- 閮ㄧ讲閲嶅惎涓嶄細涓㈠け鏁版嵁
- 寤鸿瀹氭湡浣跨敤銆屽鍑篊SV銆嶅仛鏈湴澶囦唤
- 棣栨鎵撳紑浼氳嚜鍔ㄧ敓鎴?80 鏉℃紨绀烘暟鎹?
## 澶氫汉浣跨敤

- 鎵€鏈変汉鎵撳紑鍚屼竴涓摼鎺?= 鍚屼竴浠芥暟鎹?- 褰曞叆/缂栬緫/鍒犻櫎瀹炴椂褰卞搷鎵€鏈変汉
- 椤甸潰鑷姩姣?30 绉掑悓姝ヤ竴娆℃柊鏁版嵁
- 鎵嬪姩鐐广€岎煍?鍒锋柊鏁版嵁銆嶇珛鍗冲悓姝?