// DOMが読み込まれたらイベントリスナーを追加
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM読み込み完了');
    
    // イベントリスナーを一旦リセットする補助関数
    function resetEventListeners(selector, eventType) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // 古いイベントリスナーを複製して削除
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
        });
        return document.querySelectorAll(selector);
    }
    
    // 初期データの生成とセンサー表示の更新
    initializeSensorDisplay();
    
    // サイドバーのナビゲーション機能
    const menuItems = resetEventListeners('.sidebar li', 'click');
    const pages = document.querySelectorAll('.page');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            console.log('サイドバーアイテムクリック: ', this.getAttribute('data-page'));
            // すべてのメニュー項目からアクティブクラスを削除
            menuItems.forEach(i => i.classList.remove('active'));
            // クリックされた項目にアクティブクラスを追加
            this.classList.add('active');
            
            // 対応するページを表示
            const targetPageId = this.getAttribute('data-page');
            pages.forEach(page => {
                if (page.id === targetPageId + '-page') {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
        });
    });
      // タブ切り替え機能
    const tabButtons = resetEventListeners('.tab-btn', 'click');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('タブボタン数: ', tabButtons.length);
    console.log('タブコンテンツ数: ', tabContents.length);
    
    // タブ切り替え処理をシンプルにする
    function handleTabClick(event) {
        event.preventDefault();
        const clickedBtn = event.currentTarget;
        const targetTabId = clickedBtn.getAttribute('data-tab');
        console.log('タブボタンクリック: ', targetTabId);
        
        // 現在のレイアウトを取得
        const currentLayout = document.querySelector('.dashboard-container').className.split(' ')[1];
        console.log('現在のレイアウト: ', currentLayout);
        
        // すべてのタブボタンから active クラスを削除
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // クリックされたボタンに active クラスを追加
        clickedBtn.classList.add('active');
        
        if (currentLayout === 'tabs') {
            // タブレイアウトの場合のみ、コンテンツ表示を切り替える
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 対応するタブコンテンツを表示
            const targetTab = document.getElementById(targetTabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        } else {
            // スクロールのみ
            const targetElement = document.getElementById(targetTabId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
    
    // イベントリスナーを設定
    tabButtons.forEach(button => {
        button.addEventListener('click', handleTabClick);
    });
      // レイアウト切替機能（ヘッダーのアイコンボタン）
    const layoutButtons = resetEventListeners('.icon-btn', 'click');
    console.log('レイアウトボタン数: ', layoutButtons.length);
    
    // レイアウト切り替え処理をシンプルにする
    function handleLayoutChange(event) {
        event.preventDefault();
        const clickedBtn = event.currentTarget;
        const layoutType = clickedBtn.getAttribute('data-layout');
        console.log('レイアウト切替ボタンクリック: ', layoutType);
        
        // すべてのレイアウトボタンから active クラスを削除
        document.querySelectorAll('.icon-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // クリックされたボタンに active クラスを追加
        clickedBtn.classList.add('active');
        
        // ダッシュボードコンテナのクラスを変更
        const container = document.querySelector('.dashboard-container');
        if (container) {
            container.className = 'dashboard-container ' + layoutType;
        }
        
        // タブナビゲーション要素
        const tabNavigation = document.querySelector('.tab-navigation');
        // タブコンテンツ要素
        const tabContents = document.querySelectorAll('.tab-content');
        
        if (layoutType === 'tabs') {
            // タブレイアウトの場合
            if (tabNavigation) {
                tabNavigation.style.display = 'flex';
            }
            
            // 一旦すべて非表示にする
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // アクティブなタブを取得して表示
            const activeTabBtn = document.querySelector('.tab-btn.active');
            if (activeTabBtn) {
                const activeTabId = activeTabBtn.getAttribute('data-tab');
                const activeTab = document.getElementById(activeTabId);
                if (activeTab) {
                    activeTab.classList.add('active');
                }
            } else {
                // アクティブなタブがなければ最初のタブをアクティブに
                const firstTab = document.querySelector('.tab-content');
                const firstTabBtn = document.querySelector('.tab-btn');
                if (firstTab && firstTabBtn) {
                    firstTab.classList.add('active');
                    firstTabBtn.classList.add('active');
                }
            }
        } else {
            // グリッドまたはスタック表示の場合
            if (tabNavigation) {
                tabNavigation.style.display = 'none';
            }
            
            // すべてのコンテンツを表示
            tabContents.forEach(content => {
                content.classList.add('active');
            });
        }
    }
    
    // イベントリスナーを設定
    layoutButtons.forEach(button => {
        button.addEventListener('click', handleLayoutChange);
    });
      // ズームコントロール
    const zoomOutBtn = document.querySelector('.view-control[title="ズームアウト"]');
    const zoomInBtn = document.querySelector('.view-control[title="ズームイン"]');
    const zoomLevelDisplay = document.querySelector('.zoom-level');
    let currentZoom = 100; // 100%からスタート（デフォルト等倍表示）
    
    zoomOutBtn.addEventListener('click', function() {
        if (currentZoom > 5) {
            currentZoom -= 5;
            updateZoom();
        }
    });
      zoomInBtn.addEventListener('click', function() {
        if (currentZoom < 200) {
            currentZoom += 5;
            updateZoom();
        }
    });
    
    // ズーム更新関数
    function updateZoom() {
        zoomLevelDisplay.textContent = currentZoom + '%';
        
        // 実際のズーム処理: フロー図コンテナのスケール変更
        const flowDiagram = document.querySelector('.flow-diagram-container');
        if (flowDiagram) {
            const scale = currentZoom / 100;
            
            if (currentZoom === 100) {
                // 100%の場合は変形なし（デフォルト表示）
                flowDiagram.style.transform = 'none';
                flowDiagram.style.height = 'auto';
                flowDiagram.style.minHeight = '700px';
            } else {
                flowDiagram.style.transform = `scale(${scale})`;
                flowDiagram.style.transformOrigin = 'top left';
                
                // スケールに応じて高さを調整
                flowDiagram.style.height = `${700 / scale}px`;
            }
        }
    }
    
    // ヘルプボタン
    const helpBtn = document.querySelector('.help-btn');
    helpBtn.addEventListener('click', function() {
        alert('ダッシュボードヘルプ\n\n' +
              '- タブ表示: 1つのコンテンツを全画面で表示\n' +
              '- 2カラム: 2列でコンテンツを表示\n' +
              '- 3カラム: 3列でコンテンツを表示\n' +
              '- スタック: コンテンツを縦に積み重ねて表示\n\n' +
              'ズーム機能を使用してフロー図の表示倍率を調整できます。');
    });
    
    // センサーデータのシミュレーション（実際のプロジェクトではAPIからデータ取得）
    simulateSensorData();
      // 定期的にデータを更新（5秒ごと）
    setInterval(simulateSensorData, 5000);
    
    // 初期ズームレベルを適用
    updateZoom();
});

// センサー表示の初期化と定期更新
function initializeSensorDisplay() {
    // 初期データを生成して表示
    const initialData = generateDummySensorData();
    
    try {
        // 一度だけ初期データを表示
        updateFlowDiagram(initialData);
        updateSensorList(initialData);
        updateSensorInfo(initialData);
        update3DView(initialData);
    } catch (error) {
        console.error('初期センサーデータ表示中にエラーが発生しました:', error);
    }
    
    // 注意：メインのDOMContentLoadedハンドラ内ですでにsetIntervalを呼び出しています
    // ここでは新たに呼び出さない
}

// センサーリストテーブルの更新
function updateSensorList(data) {
    const sensorTable = document.querySelector('#sensor-list table tbody');
    if (!sensorTable) return;
    
    // データの一部をテーブルに表示
    let tableHtml = '';
    const displayCount = Math.min(data.length, 10); // 最大10件まで表示
    
    for (let i = 0; i < displayCount; i++) {
        const sensor = data[i];
        let statusClass = 'normal';
        
        if (sensor.status === 'warning') {
            statusClass = 'warning';
        } else if (sensor.status === 'alert') {
            statusClass = 'alert';
        }
        
        tableHtml += `
        <tr>
            <td>${sensor.id}</td>
            <td>${sensor.location}</td>
            <td>${sensor.flow}</td>
            <td><span class="status ${statusClass}">${getStatusText(sensor.status)}</span></td>
        </tr>`;
    }
    
    sensorTable.innerHTML = tableHtml;
}

// センサーデータのシミュレーション
function simulateSensorData() {
    try {
        // ダミーセンサーデータを生成
        const sensorData = generateDummySensorData();
        
        // コンソール出力で監視
        console.log('センサーデータ更新開始:', new Date().toLocaleTimeString());
        
        // updateエラーハンドリングを個別に実施
        try {
            // テーブル更新
            updateSensorTable(sensorData);
        } catch (e) {
            console.error('テーブル更新エラー:', e);
        }
        
        try {
            // フロー図のセンサー状態を更新
            updateFlowDiagram(sensorData);
        } catch (e) {
            console.error('フロー図更新エラー:', e);
        }
        
        try {
            // センサー情報ボックス更新
            updateSensorInfo(sensorData);
        } catch (e) {
            console.error('センサー情報更新エラー:', e);
        }
        
        try {
            // 3Dビューの更新 - 異常および警告状態のセンサーのみ表示する処理
            update3DView(sensorData);
        } catch (e) {
            console.error('3Dビュー更新エラー:', e);
        }
        
        console.log('センサーデータ更新完了');
    } catch (error) {
        console.error('センサーデータシミュレーション中にエラーが発生しました:', error);
    }
}

// 3Dビューを更新する関数
function update3DView(data) {
    // 異常および警告状態のセンサーをフィルタリング
    const alertSensors = data.filter(sensor => sensor.status === 'alert');
    const warningSensors = data.filter(sensor => sensor.status === 'warning');
    
    // 3Dビュー内のSVGデータ表示を更新
    updateSvgDataDisplay(alertSensors, warningSensors);
}

// SVGデータ表示を更新
function updateSvgDataDisplay(alertSensors, warningSensors) {
    // SVG内のデータ表示要素を取得
    const svg = document.querySelector('#3d-view svg');
    if (!svg) return;
    
    try {
        // 異常状態のデータボックス更新
        if (alertSensors && alertSensors.length > 0) {
            // 赤いデータボックスを表示
            const alertBox = svg.querySelector('rect[fill="rgba(255, 235, 238, 0.95)"]');
            const alertTitle = svg.querySelector('text[fill="#cc0000"][font-weight="bold"]');
            const alertFlow = alertTitle ? alertTitle.nextElementSibling : null;
            const alertPressure = alertFlow ? alertFlow.nextElementSibling : null;
            
            if (alertBox && alertTitle && alertFlow && alertPressure) {
                alertBox.setAttribute('display', 'block');
                alertTitle.textContent = alertSensors[0].name;
                alertFlow.textContent = `流量: ${alertSensors[0].flow} L/min`;
                alertPressure.textContent = `圧力: ${alertSensors[0].pressure} MPa`;
            }
        }
        
        // 警告状態のデータボックス更新
        if (warningSensors && warningSensors.length > 0) {
            // 黄色のデータボックスを表示
            const warningBox = svg.querySelector('rect[fill="rgba(255, 248, 225, 0.95)"]');
            const warningTitle = svg.querySelector('text[fill="#ff8f00"][font-weight="bold"]');
            const warningFlow = warningTitle ? warningTitle.nextElementSibling : null;
            const warningPressure = warningFlow ? warningFlow.nextElementSibling : null;
            
            if (warningBox && warningTitle && warningFlow && warningPressure) {
                warningBox.setAttribute('display', 'block');
                warningTitle.textContent = warningSensors[0].name;
                warningFlow.textContent = `流量: ${warningSensors[0].flow} L/min`;
                warningPressure.textContent = `圧力: ${warningSensors[0].pressure} MPa`;
            }
        }
        
        // 正常状態のデータボックスは非表示
        const normalBox = svg.querySelector('rect[fill="rgba(240, 247, 255, 0.95)"]');
        if (normalBox) {
            normalBox.setAttribute('display', 'none');
        }
    } catch (error) {
        console.error('SVGデータ表示の更新中にエラーが発生しました:', error);
    }
}

// センサーテーブルの更新
function updateSensorTable(data) {
    const tbody = document.querySelector('#sensor-list table tbody');
    if (!tbody) return;
    
    // テーブル内容をクリア
    tbody.innerHTML = '';
    
    // 新しいデータでテーブルを作成
    data.forEach(sensor => {
        const row = document.createElement('tr');
        
        const idCell = document.createElement('td');
        idCell.textContent = sensor.id;
        
        const locCell = document.createElement('td');
        locCell.textContent = sensor.location;
        
        const valueCell = document.createElement('td');
        // 値は流量を表示 (監視すべき主要なパラメータとして)
        valueCell.textContent = sensor.flow;
        
        const statusCell = document.createElement('td');
        const statusSpan = document.createElement('span');
        statusSpan.className = `status ${sensor.status}`;
        statusSpan.textContent = getStatusText(sensor.status);
        statusCell.appendChild(statusSpan);
        
        row.appendChild(idCell);
        row.appendChild(locCell);
        row.appendChild(valueCell);
        row.appendChild(statusCell);
        
        tbody.appendChild(row);
    });
}

// センサー情報ボックスの更新
function updateSensorInfo(data) {
    // フロー図センサー情報を更新
    const sensorInfoA = document.querySelector('#sensor-info-a');
    if (sensorInfoA) {
        // センサーデータの中から2番目のものを表示（インデックス1）
        if (data && data.length > 1) {
            updateSensorInfoValues(sensorInfoA, data[1]); 
        }
    }
    
    // 3Dビューのセンサー情報を更新
    const sensorInfo3D = document.querySelector('#sensor-info-3d');
    if (sensorInfo3D) {
        // 異常状態のセンサーを優先的に表示
        const alertSensor = data.find(sensor => sensor.status === 'alert');
        if (alertSensor) {
            updateSensorInfoValues(sensorInfo3D, alertSensor);
            // センサー名も更新
            const title = sensorInfo3D.querySelector('h3');
            if (title) title.textContent = alertSensor.name;
        } else {
            // 警告状態のセンサーを次に優先
            const warningSensor = data.find(sensor => sensor.status === 'warning');
            if (warningSensor) {
                updateSensorInfoValues(sensorInfo3D, warningSensor);
                // センサー名も更新
                const title = sensorInfo3D.querySelector('h3');
                if (title) title.textContent = warningSensor.name;
            }
        }
    }
}

// センサー情報値の更新
function updateSensorInfoValues(infoElement, sensorData) {
    if (!infoElement || !sensorData) return;
    
    // 流量
    const flowValue = infoElement.querySelector('.flow .value');
    if (flowValue) {
        flowValue.textContent = sensorData.flow;
        flowValue.className = `value ${sensorData.flowStatus}`;
    }
    
    // 圧力
    const pressureValue = infoElement.querySelector('.pressure .value');
    if (pressureValue) {
        pressureValue.textContent = sensorData.pressure;
        pressureValue.className = `value ${sensorData.pressureStatus}`;
    }
    
    // 水量
    const waterValue = infoElement.querySelector('.water .value');
    if (waterValue) {
        waterValue.textContent = sensorData.water;
        waterValue.className = `value ${sensorData.waterStatus}`;
    }
}

// フロー図上のセンサー状態を更新
function updateFlowDiagram(data) {
    // センサーデータ（もし引数なしの場合はダミーデータを生成）
    const sensorData = data || generateDummySensorData();
    
    try {
        // 警告・発報状態のセンサーデータ
        const warningSensors = sensorData.filter(sensor => sensor.status === 'warning');
        const alertSensors = sensorData.filter(sensor => sensor.status === 'alert');
        
        // 全てのパイプボックスを更新
        const pipeBoxes = document.querySelectorAll('.pipe-box');
        
        // パイプボックスの状態を更新
        pipeBoxes.forEach((box, index) => {
            if (index >= sensorData.length) return;
            
            // 対応するセンサーのデータを取得
            const sensor = sensorData[index];
            const sensorTitle = box.querySelector('.pipe-title');
            
            // センサータイトルを更新（まだ設定されていない場合）
            if (sensorTitle && sensor.name) {
                sensorTitle.textContent = sensor.name;
            }
            
            // ボックスのスタイルクラスを更新
            box.classList.remove('warning', 'alert');
            if (sensor.status === 'warning') {
                box.classList.add('warning');
            } else if (sensor.status === 'alert') {
                box.classList.add('alert');
            }
            
            // データを更新
            updatePipeBoxData(box, sensor);
        });
        
        // すべてのクリックイベントリスナーをリセットするため、
        // 既存のイベントリスナーを削除
        pipeBoxes.forEach(box => {
            const newBox = box.cloneNode(true);
            box.parentNode.replaceChild(newBox, box);
        });
        
        // 新しいクリックイベントを設定
        document.querySelectorAll('.pipe-box').forEach((box, index) => {
            if (index < sensorData.length) {
                box.style.cursor = 'pointer';
                box.addEventListener('click', function(event) {
                    event.preventDefault();
                    const sensor = sensorData[index];
                    const title = this.querySelector('.pipe-title').textContent;
                    const flowValue = this.querySelector('.data-row:nth-child(1) .value').textContent;
                    const pressureValue = this.querySelector('.data-row:nth-child(2) .value').textContent;
                    const waterValue = this.querySelector('.data-row:nth-child(3) .value').textContent;
                    
                    alert(`${title} の詳細情報\n\n` +
                        `流量: ${flowValue} L/min\n` +
                        `圧力: ${pressureValue} MPa\n` +
                        `水量: ${waterValue} L`);
                });
            }
        });
    } catch (error) {
        console.error('フローダイアグラムの更新中にエラーが発生しました:', error);
    }
}

// パイプボックスのデータを更新する関数
function updatePipeBoxData(boxElement, data) {
    if (!boxElement || !data) return;
    
    // 状態に基づいてクラス名を調整
    const getStatusClassName = (status, baseStatus) => {
        if (status === 'high') {
            // 親ボックスが警告か異常かで色分け
            if (baseStatus === 'alert') {
                return 'high';  // 赤色
            } else if (baseStatus === 'warning') {
                return 'warning';  // 黄色
            } else {
                return 'normal';
            }
        }
        return status || 'normal';
    };
    
    // ボックスの基本的な状態を取得
    const boxStatus = boxElement.classList.contains('alert') 
        ? 'alert' 
        : (boxElement.classList.contains('warning') ? 'warning' : 'normal');
    
    // 流量
    const flowValue = boxElement.querySelector('.data-row:nth-child(1) .value');
    if (flowValue) {
        flowValue.textContent = data.flow;
        flowValue.className = `value ${getStatusClassName(data.flowStatus, boxStatus)}`;
    }
    
    // 圧力
    const pressureValue = boxElement.querySelector('.data-row:nth-child(2) .value');
    if (pressureValue) {
        pressureValue.textContent = data.pressure;
        pressureValue.className = `value ${getStatusClassName(data.pressureStatus, boxStatus)}`;
    }
    
    // 水量
    const waterValue = boxElement.querySelector('.data-row:nth-child(3) .value');
    if (waterValue) {
        waterValue.textContent = data.water;
        waterValue.className = `value ${getStatusClassName(data.waterStatus, boxStatus)}`;
    }
}

// タイルのコントロールボタンにイベントリスナーを追加
document.addEventListener('DOMContentLoaded', function() {
    const tileControls = document.querySelectorAll('.tile-control');
    tileControls.forEach(control => {
        control.addEventListener('click', function() {
            const tile = this.closest('.dashboard-tile');
            const tileId = tile.id;
            const tileTitle = tile.querySelector('h2').textContent;
            
            const menu = [
                'データの更新', 
                'フィルター設定', 
                'エクスポート',
                'このウィジェットを閉じる'
            ];
            
            const menuHtml = menu.map(item => `<div class="menu-item">${item}</div>`).join('');
            
            alert(`${tileTitle} メニュー\n\n${menu.join('\n')}`);
            
            // 実際の実装では、ポップアップメニューを表示
            /* 
            const contextMenu = document.createElement('div');
            contextMenu.className = 'context-menu';
            contextMenu.innerHTML = menuHtml;
            document.body.appendChild(contextMenu);
            
            // ポジショニングとイベント処理
            // ...
            */
        });
    });
    
    // 初期ロード時のレイアウトチェック
    const dashboardContainer = document.querySelector('.dashboard-container');
    const tabNavigation = document.querySelector('.tab-navigation');
    
    if (dashboardContainer) {
        // 現在のレイアウトタイプを取得
        const currentLayout = dashboardContainer.className.split(' ')[1];
        
        // タブ表示でない場合はタブナビゲーションを非表示に
        if (currentLayout !== 'tabs') {
            tabNavigation.style.display = 'none';
        }
    }
});

// ランダム値の生成（min〜maxの範囲）
function randomValue(min, max) {
    return min + Math.random() * (max - min);
}

// 状態コードから日本語テキスト取得
function getStatusText(status) {
    switch (status) {
        case 'normal': return '正常';
        case 'warning': return '警告';
        case 'alert': return '異常';
        default: return '不明';
    }
}

// ダミーのセンサーデータを生成
function generateDummySensorData() {
    // 各センサーの情報を定義（名前、ID、場所など）
    const sensorDefinitions = [
        { id: 'P-101', name: '原水入口 P-101', location: '原水入口' },
        { id: 'F-201', name: '前処理系 F-201', location: '前処理系' },
        { id: 'T-305', name: '処理タンク T-305', location: '処理タンク' },
        { id: 'S-401', name: '沈殿槽 S-401', location: '沈殿槽' },
        { id: 'F-102', name: 'フィルター F-102', location: 'フィルター' },
        { id: 'P-203', name: '中間槽 P-203', location: '中間槽' },
        { id: 'C-204', name: '循環ポンプ C-204', location: '循環ポンプ' },
        { id: 'D-501', name: '貯水槽 D-501', location: '貯水槽' },
        { id: 'P-502', name: '返送ポンプ P-502', location: '返送ポンプ' },
        { id: 'C-601', name: '排出制御 C-601', location: '排出制御' },
        { id: 'V-801', name: '最終放流 V-801', location: '最終放流' },
    ];
    
    const sensorData = [];
    
    // 各センサー定義に基づいてデータを生成
    sensorDefinitions.forEach((def, i) => {
        // 基本パラメータの設定
        let status = 'normal';
        let flow = Math.floor(randomValue(30, 60));
        let pressure = Math.floor(randomValue(40, 60));
        let water = Math.floor(randomValue(40, 60));
        let flowStatus = 'normal';
        let pressureStatus = 'normal';
        let waterStatus = 'normal';
        
        // 特定のセンサーを警告/異常状態に
        if (def.id === 'F-102' || def.id === 'P-203') {
            // 警告状態のセンサー
            status = 'warning';
            pressure = Math.floor(randomValue(450, 550));
            pressureStatus = 'warning';
            
            if (def.id === 'P-203') {
                flow = Math.floor(randomValue(700, 950));
                water = Math.floor(randomValue(700, 950));
                flowStatus = 'warning';
                waterStatus = 'warning';
            }
        } else if (def.id === 'C-601' || def.id === 'V-801') {
            // 異常状態のセンサー
            status = 'alert';
            flow = Math.floor(randomValue(1000, 1200));
            water = Math.floor(randomValue(1000, 1200));
            pressure = Math.floor(randomValue(550, 650));
            flowStatus = 'high';
            waterStatus = 'high';
            pressureStatus = 'high';
        }
        
        sensorData.push({
            id: def.id,
            name: def.name,
            location: def.location,
            flow,
            pressure,
            water,
            flowStatus,
            pressureStatus,
            waterStatus,
            status
        });
    });
    
    return sensorData;
}
