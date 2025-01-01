/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/*
@	Author : Twdtwd
@       Author : Ronan
@
@	NPC = Violet Balloon
@	Map = Hidden-Street <Crack on the Wall>
@	NPC MapId = 922010900
@	Function = LPQ - Last Stage
@
@	Description: Used after the boss is killed to trigger the bonus stage.
*/

var status = 0;
var curMap, stage;

function start() {
    curMap = cm.getMapId();
    stage = Math.floor((curMap - 922010100) / 100) + 1;

    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else if (mode == 0) {
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        var eim = cm.getPlayer().getEventInstance();

        if(eim == null){
            cm.warp(922010000, 0);
            cm.sendOk("你不在任何组队任务中,我只能送你到这了。");
            cm.dispose()
            return;
        }

        if (eim.getProperty(stage.toString() + "stageclear") != null) {
            if (status == 1){
                cm.warp(922011100, 0);
            }else {
                cm.sendOk("恭喜你！你已经打败了Boss#b阿丽莎乐#k,我送你到外面去吧。");
                status = 0;
                return
            }
        } else {
            if (eim.isEventLeader(cm.getPlayer())) {
                var state = eim.getIntProperty("statusStg" + stage);

                if (state == -1) {           // preamble
                    cm.sendOk("这是最后一个阶段；这将是对你力量的最后考验。杀死台子上的#b玩具黑鼠#k就会召唤#b阿丽莎乐#k，给我它掉落的#b#t4001023#k,你就通关了，祝你好运。");
                    eim.setProperty("statusStg" + stage, 0);
                } else {                      // check stage completion
                    if (cm.haveItem(4001023, 1)) {
                        cm.gainItem(4001023, -1);
                        eim.setProperty("statusStg" + stage, 1);

                        var list = eim.getClearStageBonus(stage);     // will give bonus exp & mesos to everyone in the event
                        eim.giveEventPlayersExp(list.get(0));
                        eim.giveEventPlayersMeso(list.get(1));
                        eim.setProperty(stage + "stageclear", "true");
                        eim.showClearEffect(true);
                        eim.clearPQ();
                    } else {
                        cm.sendNext("请击败#b阿丽莎乐#k并把他的#b#t4001023#带给我。#k");
                    }
                }
            } else {
                cm.sendNext("请告诉你的#b队长#k来找我谈话。");
            }
        }

        cm.dispose();
    }
}