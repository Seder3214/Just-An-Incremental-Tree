addLayer("b", {
    name: "Binary", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        lineLength: new Decimal(0),
        lineZeroLength: new Decimal(0),
        lineOneLength: new Decimal(0),
        lineTwoLength: new Decimal(0),
        binary: "",
    }},
    color: "#bf13b6",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "binaries", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(tmp.b.tEffect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    tabFormat: {
        "Main": {
        content:[
            function() {if (player.tab == "b") return "main-display"},
            function() { if (player.tab == "b")  return ["column", [
                "prestige-button",
               ["blank", "25px"],
               ['infobox','eff'],
               "clickables",
            ]]
        }
    ],
},
"Buyables": {
    content:[
        function() {if (player.tab == "b") return "main-display"},
        function() { if (player.tab == "b")  return ["column", [
            "prestige-button",
           ["blank", "25px"],
           "buyables",
        ]]
    }
],
},
"Upgrades": {
    content:[
        function() {if (player.tab == "b") return "main-display"},
        function() { if (player.tab == "b")  return ["column", [
            "prestige-button",
           ["blank", "25px"],
           "upgrades",
        ]]
    }
],
},
    },
    zEffect() {
 let x = new Decimal(1)
 return x = x.add(hasUpgrade('b',11)?buyableEffect("b",11):0).mul(player.b.lineZeroLength.mul(player.b.lineLength.gte(30)?buyableEffect("b",12):1).add(1).pow(new Decimal(0.75)))
    },
    oEffect() {
        let x = new Decimal(1)
        return x =x.add(hasUpgrade('b',11)?buyableEffect("b",11).div(4):0).mul(player.b.lineOneLength.add(1).pow(new Decimal(0.75)))
           },
           tEffect() {
            let x = new Decimal(2)
            return x = x.mul(player.b.lineTwoLength).div(new Decimal(2).add(1).pow(0.35)).max(1)
               },
    clickables: {
        11: {
            unlocked(){return true},
            cost(){let cost = new Decimal(1)
                cost = cost.div(tmp.b.oEffect)
                return cost.mul(player.b.lineLength.add(1).pow(player.b.lineLength.gte(30)?2.25:1.75)).floor()},
            title() {return "Extend Binary Code"},
            display() {return "Add 0 to line.<br> Req: " + format(this.cost()) + " Binaries"},
            canClick() {return player.b.points.gte(this.cost())},
            onClick() {
                player.b.points = player.b.points.sub(this.cost())
                player.b.lineLength = player.b.lineLength.add(1)
                player.b.lineZeroLength = player.b.lineZeroLength.add(1)
                return player.b.binary += "0"
            },
        },
        12: {
            unlocked(){return true},
            cost(){let cost = new Decimal(1)
                cost = cost.div(tmp.b.oEffect)
                return cost.mul(player.b.lineLength.add(1).pow(player.b.lineLength.gte(30)?2.25:1.75)).floor()},
            title() {return "Extend Binary Code"},
            display() {return "Add 1 to line.<br> Req: " + format(this.cost()) + " Binaries"},
            canClick() {return player.b.points.gte(this.cost())},
            onClick() {
                player.b.points = player.b.points.sub(this.cost())
                player.b.lineLength = player.b.lineLength.add(1)
                player.b.lineOneLength = player.b.lineOneLength.add(1)
                return player.b.binary += "1"
            },
        },
        13: {
            unlocked(){return hasUpgrade("b", 13)},
            cost(){let cost = new Decimal(200)
                return cost.mul(player.b.lineTwoLength.add(1).pow(1.5)).floor()},
            title() {return "Extend Ternary Code"},
            display() {return "Add 2 to line.<br> Req: " + format(this.cost()) + " Binaries"},
            canClick() {return player.b.points.gte(this.cost())},
            onClick() {
                player.b.points = player.b.points.sub(this.cost())
                player.b.lineLength = player.b.lineLength.add(1)
                player.b.lineTwoLength = player.b.lineTwoLength.add(1)
                return player.b.binary += "2"
            },
        },
    },
    infoboxes: {
        eff: {
            title: "Effects:",
            body() {let next = '-------'
            let ter = " "
            if (hasUpgrade("b", 13)) ter = "Ternary (2): (2*<b>2</b>/2 + 1)<sup>0.35</sup>) "
            let bin = "Binary (0): 1 * ( ( <b>0</b> + 1 )<sup>0.75</sup>)<br> Binary (1): 1 * ( ( <b>1</b> + 1 )<sup>0.75</sup>)"
            if (hasUpgrade('b',11)) bin = "Binary (0): 1 + "+  format(buyableEffect("b",11))+ " * ( ( <b>0</b> + 1 )<sup>0.75" +" </sup><br> Binary (1): 1 + "+  format(buyableEffect("b",11))+ "(a)/4 * ( ( <b>1</b> + 1 )<sup>0.75</sup>)"
            if (player.b.lineLength.gte(30))  bin = "Binary (0): 1 + "+  format(buyableEffect("b",11))+ " * ( ( <b>0</b> * " + format(buyableEffect("b",12)) + "(b) + 1 )<sup>0.75" +" </sup><br> Binary (1): 1 + "+  format(buyableEffect("b",11))+ "(a)/4 * ( ( <b>1</b> + 1 )<sup>0.75</sup>)"
            if (player.b.lineLength.lt(10)) next = "New row of upgrades at 10 digits in code."
            if (player.b.lineLength.gte(10) && player.b.lineLength.lt(30)) next = "New variable at 30 digits in code."
            if (player.b.lineLength.gte(30)) return  "Your ternary code: <br>" + " 0's: " + format(player.b.lineZeroLength) + "<br> 1's: " + format(player.b.lineOneLength) + "<br> 2's: " + format(player.b.lineTwoLength) + " ( Total Length: " + format(player.b.lineLength) + " Digits)<br>" + next + "<br>Amount of <b>0</b> in code: Increases point gain by " + format(tmp.b.zEffect) + "x. <br> Amount of <b>1</b> in code: Reduces binary (0; 1) extend cost by /" + format(tmp.b.oEffect) + "<br> Amount of <b>2</b> in code: Boosts binaries gain by "+ format(tmp.b.tEffect) + "x <br>Formulas: <br>" + bin + "<br>" + ter
            if (hasUpgrade("b", 13)) return  "Your ternary code: <br>" + player.b.binary + " (Length: " + format(player.b.lineLength) + " Digits)<br>" + next + "<br>Amount of <b>0</b> in code: Increases point gain by " + format(tmp.b.zEffect) + "x. <br> Amount of <b>1</b> in code: Reduces binary (0; 1) extend cost by /" + format(tmp.b.oEffect) + "<br> Amount of <b>2</b> in code: Boosts binaries gain by "+ format(tmp.b.tEffect) + "x <br>Formulas: <br>" + bin + "<br>" + ter
            else return "Your binary code: <br>" + player.b.binary + " (Length: " + format(player.b.lineLength) + " Digits)<br>" + next + "<br>Amount of <b>0</b> in code: Increases point gain by " + format(tmp.b.zEffect) + "x. <br> Amount of <b>1</b> in code: Reduces binary (0; 1) extend cost by /" + format(tmp.b.oEffect) + "<br>Formulas: <br>" + bin + "<br>" + ter },
        },
    },
    upgrades: {
        11: {
            unlocked() {return player.b.lineLength.gte(10)},
            title: "[a]",
            description: "Add <b>[a]</b> new variable to Binary (0) formula.",
            cost: new Decimal(25),
        },
        12: {
            unlocked() {return hasUpgrade("b",11)},
            title: "[Boost]",
            description: "Boost Points gain by <b>Total Length</b>.",
            effect() {return player.b.lineLength.add(1).pow(0.5)},
            effectDisplay() {return "x"+ format(this.effect(),3)},
            cost: new Decimal(75),
        },
        13: {
            unlocked() {return hasUpgrade("b",12)},
            title: "[2]",
            description: "Unlock a new numeral system: <b>Ternary</b>.",
            cost: new Decimal(250),
        },
    },
    buyables: {
        11: {
            unlocked() {return hasUpgrade("b",11)},
            cost(x) { return new Decimal(100).pow(x.add(1).div(1.75)) },
            title() { return "Increase <b>[a]</b> value" },
            display() {return "<br><b><h2>Cost:</h2> " + format(this.cost())+ " Points</b><br><b><h2>Amount:</h3> " + format(player.b.buyables[11]) + "</b><br><b><h2>Variable Value:</h3> " + format(this.effect()) + "</b>"},
            canAfford() { return player.points.gte(this.cost()) },
            effect(x) {
                let eff = new Decimal(1.25)
                eff = eff.mul(x).add(1)
                return eff
            },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        12: {
            unlocked() {return player.b.lineLength.gte(30)},
            cost(x) { return new Decimal(40000).pow(x.add(1).div(3.25)) },
            title() { return "Increase <b>[b]</b> value" },
            display() {return "<br><b><h2>Cost:</h2> " + format(this.cost())+ " Points</b><br><b><h2>Amount:</h3> " + format(player.b.buyables[12]) + "</b><br><b><h2>Variable Value:</h3> " + format(this.effect()) + "</b>"},
            canAfford() { return player.points.gte(this.cost()) },
            effect(x) {
                let eff = new Decimal(0.3)
                eff = eff.add(1).mul(x)
                return eff
            },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})