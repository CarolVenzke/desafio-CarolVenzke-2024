class RecintosZoo {
    constructor(){
        this.recintos = [
            new Recinto(1,new Set(['savana']),10,Array(10)),
            new Recinto(2,new Set(['floresta']), 5, Array(5)),
            new Recinto(3,new Set(['savana','rio']), 7, Array(7)),
            new Recinto(4,new Set(['rio']), 8, Array(8)),
            new Recinto(5, new Set(['savana']), 9, Array(9))
        ]

        const animalFactory = new AnimalFactory()
        this.recintos[0].adicionarAnimal(animalFactory.criaAnimal('macaco'))
        this.recintos[0].adicionarAnimal(animalFactory.criaAnimal('macaco'))
        this.recintos[0].adicionarAnimal(animalFactory.criaAnimal('macaco'))

        this.recintos[2].adicionarAnimal(animalFactory.criaAnimal('gazela'))
        this.recintos[4].adicionarAnimal(animalFactory.criaAnimal('leao'))
    }

    analisaRecintos(animal, quantidade) {
        const factory = new AnimalFactory();
        const novoAnimal = factory.criaAnimal(animal);

        if (novoAnimal === 'Animal inválido') {
            return { erro: 'Animal inválido' };
        }
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: 'Quantidade inválida' };
        }

        let recintosViaveis = [];
        for (let i = 0; i < this.recintos.length; i++) {
            let recinto = this.recintos[i];

            // Calcula o tamanho necessário para os animais
            let tamanhoAnimais = novoAnimal.tamanho * quantidade;
            let espacoExtra = recinto.animaisExistentes.some(a => a.especie !== novoAnimal.especie) ? 1 : 0;
            
            // Valida se o recinto tem espaço suficiente
            if (!recinto.hasEnoughSpace(tamanhoAnimais+espacoExtra)) continue;

            // Valida se o bioma é adequado
            if (!recinto.isBiomeCompatible(novoAnimal)) continue;

            // Valida regras de convivência dos carnívoros e não carnivoros
            if (novoAnimal.isCarnivore()) {
                if (!recinto.isCarnivoreCompatible(novoAnimal)) continue;
            } else {
                if (!recinto.isNonCarnivoreCompatible()) continue;
            }

            // Validação para hipopótamo conviver com outras especieis
            if (novoAnimal.isHipopotamo()){
                if (!recinto.isHipopotamoValid()) continue;
            }
            // Validação para macaco nao estar sozinho
            if (novoAnimal.isMacaco()){
                if (!recinto.isMacacoValid(quantidade)) continue;
            }

            let espacoLivre = recinto.tamanhoTotal - (recinto.tamanhoOcupado + (tamanhoAnimais) + espacoExtra);
            recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`);
        }

        if (recintosViaveis.length === 0) {
            return { erro: 'Não há recinto viável' };
        }
    
        return {'recintosViaveis':recintosViaveis };
    }

    }   


export { RecintosZoo as RecintosZoo };

class Recinto {
    constructor(numero, bioma, tamanhoTotal){
        this.numero = numero;
        this.bioma = bioma;
        this.tamanhoTotal = tamanhoTotal;
        this.tamanhoOcupado = 0
        this.animaisExistentes = [];
    }

    adicionarAnimal(animal){
        this.tamanhoOcupado += animal.tamanho
        this.animaisExistentes.push(animal)
    }
    
    hasEnoughSpace(tamanhoAnimais) {
        return this.tamanhoTotal - this.tamanhoOcupado > tamanhoAnimais
    }

    isBiomeCompatible(animal) {
        let biomasComuns = new Set([...animal.bioma].filter(bioma => this.bioma.has(bioma)));
        return biomasComuns.size > 0
    }

    isCarnivoreCompatible(animal) {
        let carnívoros = this.animaisExistentes.filter(a => a.alimentacao === 'carnivoro');
        if (carnívoros.length > 0 && !carnívoros.every(a => a.especie === animal.especie)) return false;

        let naoCarnivoros = this.animaisExistentes.filter(a => a.alimentacao !== 'carnivoro');
        if (naoCarnivoros.length > 0) return false;

        return true
    }

    isNonCarnivoreCompatible() {
        return !this.animaisExistentes.some(a => a.alimentacao === 'carnivoro')
    }

    isHipopotamoValid() {
        return (this.bioma.has('savana') && this.bioma.has('rio')) ||
                   this.animaisExistentes.every(a => a.especie === 'HIPOPOTAMO');
    }

    isMacacoValid(quantidade) {
        if (this.animaisExistentes.length === 0) {
            return quantidade > 1;
        }
        return true;
    }
}

class Animal {
    constructor(especie, tamanho, bioma,alimentacao) {
        this.especie = especie;
        this.tamanho = tamanho;
        this.bioma = bioma;
        this.alimentacao = alimentacao;

    }

    isCarnivore() {
        return this.alimentacao === 'carnivoro';
    }

    isHipopotamo() {
        return this.especie === 'HIPOPOTAMO';
    }

    isMacaco() {
        return this.especie === 'MACACO';
    }
}

class AnimalFactory{
    animais = {
        LEAO: new Animal("LEAO", 3, new Set(["savana"]), "carnivoro"),
        LEOPARDO: new Animal("LEOPARDO", 2, new Set(["savana"]), "carnivoro"),
        CROCODILO: new Animal("CROCODILO", 3, new Set(["rio"]), "carnivoro"),
        MACACO: new Animal("MACACO", 1, new Set(["savana","floresta"]), "onívoro"),
        GAZELA: new Animal("GAZELA", 2, new Set(["savana"]), "herbivoro"),
        HIPOPOTAMO: new Animal("HIPOPOTAMO", 4, new Set(["savana", "rio"]), "herbivoro")
    }

    criaAnimal(nome){
        const animal = this.animais[nome.toUpperCase()];
        if (!animal) {
            return "Animal inválido";
        }    
        return animal
    }
}