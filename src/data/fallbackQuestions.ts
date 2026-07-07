import { Question } from '../types';

export const fallbackQuestions: Question[] = [
  // 1. A SANTA MISSA
  {
    id: 'f_missa_1',
    theme: 'A SANTA MISSA',
    questionText: 'Qual é a principal finalidade da oração cristã?',
    options: [
      { letter: 'A', text: 'Pedir coisas materiais' },
      { letter: 'B', text: 'Cumprir um dever' },
      { letter: 'C', text: 'Conversar e se unir a Deus' },
      { letter: 'D', text: 'Mostrar santidade para os outros' }
    ],
    correctAnswerText: 'Conversar e se unir a Deus',
    correctLetter: 'C'
  },
  {
    id: 'f_missa_2',
    theme: 'A SANTA MISSA',
    questionText: 'Qual destas é uma forma de oração?',
    options: [
      { letter: 'A', text: 'Leituras de jornal' },
      { letter: 'B', text: 'Novela da televisão' },
      { letter: 'C', text: 'Meditação sobre a palavra de Deus' },
      { letter: 'D', text: 'Discussão política' }
    ],
    correctAnswerText: 'Meditação sobre a palavra de Deus',
    correctLetter: 'C'
  },
  
  // 2. EUCARISTIA E OS SACRAMENTOS
  {
    id: 'f_euca_1',
    theme: 'EUCARISTIA E OS',
    questionText: 'A Eucaristia é:',
    options: [
      { letter: 'A', text: 'Apenas um símbolo' },
      { letter: 'B', text: 'O corpo e o sangue de Cristo' },
      { letter: 'C', text: 'Um pão comum abençoado' },
      { letter: 'D', text: 'Uma lembrança histórica' }
    ],
    correctAnswerText: 'O corpo e o sangue de Cristo',
    correctLetter: 'B'
  },
  {
    id: 'f_euca_2',
    theme: 'EUCARISTIA E OS',
    questionText: 'Quem foi o primeiro Papa da Igreja Católica?',
    options: [
      { letter: 'A', text: 'São João Paulo II' },
      { letter: 'B', text: 'São Francisco' },
      { letter: 'C', text: 'São Pedro' },
      { letter: 'D', text: 'Santo Agostinho' }
    ],
    correctAnswerText: 'São Pedro',
    correctLetter: 'C'
  },

  // 3. SANTISSIMA TRINDADE
  {
    id: 'f_trin_1',
    theme: 'SANTISSIMA TRINDADE',
    questionText: 'A Santíssima Trindade é composta por:',
    options: [
      { letter: 'A', text: 'Pai, Filho e Espírito Santo' },
      { letter: 'B', text: 'Jesus, Maria e José' },
      { letter: 'C', text: 'Pedro, Tiago e João' },
      { letter: 'D', text: 'Abraão, Isaac e Jacó' }
    ],
    correctAnswerText: 'Pai, Filho e Espírito Santo',
    correctLetter: 'A'
  },
  {
    id: 'f_trin_2',
    theme: 'SANTISSIMA TRINDADE',
    questionText: 'Sobre a Trindade, o que podemos afirmar de acordo com a nossa fé?',
    options: [
      { letter: 'A', text: 'São três deuses diferentes' },
      { letter: 'B', text: 'Um único Deus em três pessoas distintas' },
      { letter: 'C', text: 'Apenas três símbolos sem divindade' },
      { letter: 'D', text: 'Uma invenção medieval' }
    ],
    correctAnswerText: 'Um único Deus em três pessoas distintas',
    correctLetter: 'B'
  },

  // 4. O FILHO DE DEUS
  {
    id: 'f_filho_1',
    theme: 'O FILHO DE DEUS',
    questionText: 'Jesus Cristo é:',
    options: [
      { letter: 'A', text: 'Apenas um profeta' },
      { letter: 'B', text: 'Um grande filósofo' },
      { letter: 'C', text: 'O Filho de Deus encarnado' },
      { letter: 'D', text: 'Um mito grego' }
    ],
    correctAnswerText: 'O Filho de Deus encarnado',
    correctLetter: 'C'
  },

  // 5. O ESPIRITO SANTO
  {
    id: 'f_espirito_1',
    theme: 'O ESPIRITO SANTO',
    questionText: 'O Espírito Santo é:',
    options: [
      { letter: 'A', text: 'Uma força cósmica sem vida' },
      { letter: 'B', text: 'A terceira pessoa da Santíssima Trindade, que nos guia e santifica' },
      { letter: 'C', text: 'Um anjo especial que protege a Igreja' },
      { letter: 'D', text: 'Um sentimento humano de bondade' }
    ],
    correctAnswerText: 'A terceira pessoa da Santíssima Trindade, que nos guia e santifica',
    correctLetter: 'B'
  },

  // 6. PENTECOSTES
  {
    id: 'f_pente_1',
    theme: 'PENTECOSTES',
    questionText: 'O que recorda a solenidade de Pentecostes?',
    options: [
      { letter: 'A', text: 'A descida do Espírito Santo sobre a Virgem Maria e os apóstolos' },
      { letter: 'B', text: 'O nascimento físico de Jesus em Belém' },
      { letter: 'C', text: 'A ressurreição de Lázaro' },
      { letter: 'D', text: 'A travessia do Mar Vermelho' }
    ],
    correctAnswerText: 'A descida do Espírito Santo sobre a Virgem Maria e os apóstolos',
    correctLetter: 'A'
  },

  // 7. ASCENSÃO DO SENHOR
  {
    id: 'f_asc_1',
    theme: 'ASCENSÃO DO SENHOR',
    questionText: 'O que celebramos na Solenidade da Ascensão do Senhor?',
    options: [
      { letter: 'A', text: 'A ressurreição de Jesus no terceiro dia' },
      { letter: 'B', text: 'A subida gloriosa de Jesus ao céu, quarenta dias após a Páscoa' },
      { letter: 'C', text: 'A apresentação de Jesus no Templo por Maria e José' },
      { letter: 'D', text: 'A transfiguração no Monte Tabor' }
    ],
    correctAnswerText: 'A subida gloriosa de Jesus ao céu, quarenta dias após a Páscoa',
    correctLetter: 'B'
  },

  // 8. QUEM É NOSSA SENHORA
  {
    id: 'f_nossa_1',
    theme: 'QUEM É NOSSA SENHORA',
    questionText: 'A Virgem Maria foi escolhida por Deus para ser:',
    options: [
      { letter: 'A', text: 'Apenas uma discípula comum de Pedro' },
      { letter: 'B', text: 'A Mãe de Deus Filho encarnado' },
      { letter: 'C', text: 'Uma rainha com poder político na época' },
      { letter: 'D', text: 'Um símbolo poético, não histórico' }
    ],
    correctAnswerText: 'A Mãe de Deus Filho encarnado',
    correctLetter: 'B'
  },

  // 9. O PECADO
  {
    id: 'f_pec_1',
    theme: 'O PECADO',
    questionText: 'O que é o pecado na teologia católica?',
    options: [
      { letter: 'A', text: 'Um erro de etiqueta social' },
      { letter: 'B', text: 'Uma ofensa livre a Deus e quebra de comunhão com o próximo' },
      { letter: 'C', text: 'Um conceito criado para fins comerciais' },
      { letter: 'D', text: 'Apenas um instinto natural inofensivo' }
    ],
    correctAnswerText: 'Uma ofensa livre a Deus e quebra de comunhão com o próximo',
    correctLetter: 'B'
  },

  // 10. O REGRESSO DE JESUS
  {
    id: 'f_reg_1',
    theme: 'O REGRESSO DE JESUS',
    questionText: 'O que diz o Credo sobre a vinda gloriosa de Jesus no fim dos tempos?',
    options: [
      { letter: 'A', text: 'Que Ele virá para julgar os vivos e os mortos' },
      { letter: 'B', text: 'Que Ele nunca retornará' },
      { letter: 'C', text: 'Que Ele reinará com armas materiais na terra' },
      { letter: 'D', text: 'Que Ele retornará sob uma forma oculta que ninguém verá' }
    ],
    correctAnswerText: 'Que Ele virá para julgar os vivos e os mortos',
    correctLetter: 'A'
  },

  // 11. JESUS MAIS QUE UM
  {
    id: 'f_mais_1',
    theme: 'JESUS MAIS QUE UM',
    questionText: 'Jesus é apenas um mestre moral ou profeta histórico?',
    options: [
      { letter: 'A', text: 'Sim, Ele é comparável a outros filósofos' },
      { letter: 'B', text: 'Não, Ele é o próprio Deus feito homem, Salvador do mundo' },
      { letter: 'C', text: 'Ele era apenas um líder político zelote' },
      { letter: 'D', text: 'Não, Ele é um anjo que fingiu ter um corpo' }
    ],
    correctAnswerText: 'Não, Ele é o próprio Deus feito homem, Salvador do mundo',
    correctLetter: 'B'
  },

  // 12. NOSSA FE NOS REUNA
  {
    id: 'f_fe_1',
    theme: 'NOSSA FE NOS REUNA',
    questionText: 'Quais são as quatro marcas características da verdadeira Igreja de Cristo?',
    options: [
      { letter: 'A', text: 'Rica, Antiga, Moderna e Democrática' },
      { letter: 'B', text: 'Uma, Santa, Católica e Apostólica' },
      { letter: 'C', text: 'Oculta, Perfeita, Europeia e Isolada' },
      { letter: 'D', text: 'Provisória, Mutável, Dividida e Universal' }
    ],
    correctAnswerText: 'Uma, Santa, Católica e Apostólica',
    correctLetter: 'B'
  },

  // 13. COMOS IGREJA
  {
    id: 'f_como_1',
    theme: 'COMOS IGREJA',
    questionText: 'A palavra "Católica" significa:',
    options: [
      { letter: 'A', text: 'Universal, aberta a toda a humanidade' },
      { letter: 'B', text: 'Restrita a um grupo de santos' },
      { letter: 'C', text: 'Exclusiva de Roma e da Europa' },
      { letter: 'D', text: 'Apenas tradicional e antiga' }
    ],
    correctAnswerText: 'Universal, aberta a toda a humanidade',
    correctLetter: 'A'
  },

  // 14. HISTORIA DA IGREJA
  {
    id: 'f_hist_1',
    theme: 'HISTORIA DA IGREJA',
    questionText: 'O que celebra o Domingo de Ramos que abre a Semana Santa?',
    options: [
      { letter: 'A', text: 'A última ceia de Jesus com Seus apóstolos' },
      { letter: 'B', text: 'A entrada triunfal de Jesus em Jerusalém' },
      { letter: 'C', text: 'A crucificação no Calvário' },
      { letter: 'D', text: 'A descida do Espírito Santo' }
    ],
    correctAnswerText: 'A entrada triunfal de Jesus em Jerusalém',
    correctLetter: 'B'
  }
];
