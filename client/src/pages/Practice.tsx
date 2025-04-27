import { useState, useCallback, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Question } from '@/lib/types';
import ProgressBar from '@/components/ProgressBar';
import QuestionOption from '@/components/QuestionOption';
import { playSound } from '@/lib/sound';

// Dados estáticos para testes
const mockQuestions: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      text: 'Qual a característica principal do gênero textual "notícia"?',
      options: [
        { id: 1, text: 'Subjetividade e opiniões pessoais', correct: false },
        { id: 2, text: 'Objetividade e informação factual', correct: true },
        { id: 3, text: 'Uso de linguagem poética', correct: false },
        { id: 4, text: 'Obrigatoriedade de conclusão com moral', correct: false }
      ],
      explanation: 'A notícia é caracterizada pela objetividade e apresentação de fatos, buscando informar o leitor sem expressar opiniões pessoais do autor.'
    },
    {
      id: 2,
      text: 'Qual destes NÃO é considerado um gênero textual?',
      options: [
        { id: 1, text: 'Carta', correct: false },
        { id: 2, text: 'Romance', correct: false },
        { id: 3, text: 'Substantivo', correct: true },
        { id: 4, text: 'Resenha', correct: false }
      ],
      explanation: 'Substantivo é uma classe gramatical, não um gênero textual. Os gêneros textuais são formas de organização do texto com características específicas.'
    },
    {
      id: 3,
      text: 'O gênero textual "artigo de opinião" tem como principal objetivo:',
      options: [
        { id: 1, text: 'Narrar uma história fictícia', correct: false },
        { id: 2, text: 'Defender um ponto de vista', correct: true },
        { id: 3, text: 'Descrever um procedimento passo a passo', correct: false },
        { id: 4, text: 'Apenas informar sobre um acontecimento', correct: false }
      ],
      explanation: 'O artigo de opinião visa defender um ponto de vista sobre determinado assunto, utilizando argumentos para convencer o leitor.'
    },
    {
      id: 4,
      text: 'Qual característica é essencial em um texto do gênero "manual de instruções"?',
      options: [
        { id: 1, text: 'Linguagem poética', correct: false },
        { id: 2, text: 'Sequência cronológica de eventos', correct: false },
        { id: 3, text: 'Clareza e objetividade nas orientações', correct: true },
        { id: 4, text: 'Expressão de sentimentos pessoais', correct: false }
      ],
      explanation: 'O manual de instruções precisa ser claro e objetivo para que o leitor consiga seguir as orientações corretamente.'
    },
    {
      id: 5,
      text: 'No gênero textual "crônica", é comum encontrar:',
      options: [
        { id: 1, text: 'Linguagem técnica e específica', correct: false },
        { id: 2, text: 'Reflexões sobre o cotidiano', correct: true },
        { id: 3, text: 'Dados estatísticos comprobatórios', correct: false },
        { id: 4, text: 'Estrutura rígida de introdução, desenvolvimento e conclusão', correct: false }
      ],
      explanation: 'A crônica geralmente aborda fatos do cotidiano com uma linguagem leve, muitas vezes com humor e reflexões sobre a vida comum.'
    }
  ],
  2: [
    {
      id: 1,
      text: 'Qual é o resultado de 7² + 3³?',
      options: [
        { id: 1, text: '49', correct: false },
        { id: 2, text: '76', correct: true },
        { id: 3, text: '79', correct: false },
        { id: 4, text: '58', correct: false }
      ],
      explanation: '7² + 3³ = 49 + 27 = 76'
    },
    {
      id: 2,
      text: 'Simplifique a expressão: 2(x + 3) - 5(x - 1)',
      options: [
        { id: 1, text: '-3x + 11', correct: true },
        { id: 2, text: '3x - 11', correct: false },
        { id: 3, text: '-3x - 11', correct: false },
        { id: 4, text: '7x + 1', correct: false }
      ],
      explanation: '2(x + 3) - 5(x - 1) = 2x + 6 - 5x + 5 = -3x + 11'
    },
    {
      id: 3,
      text: 'Se log₁₀(x) = 2, então o valor de x é:',
      options: [
        { id: 1, text: '10', correct: false },
        { id: 2, text: '100', correct: true },
        { id: 3, text: '1000', correct: false },
        { id: 4, text: '0.01', correct: false }
      ],
      explanation: 'Se log₁₀(x) = 2, então x = 10² = 100'
    },
    {
      id: 4,
      text: 'Uma matriz identidade possui:',
      options: [
        { id: 1, text: 'Zeros em toda parte', correct: false },
        { id: 2, text: 'Uns em toda parte', correct: false },
        { id: 3, text: 'Uns na diagonal principal e zeros nas demais posições', correct: true },
        { id: 4, text: 'Números diferentes em cada posição', correct: false }
      ],
      explanation: 'Uma matriz identidade possui 1 em toda a diagonal principal e 0 em todas as outras posições'
    },
    {
      id: 5,
      text: 'Uma matriz quadrada possui:',
      options: [
        { id: 1, text: 'Número de linhas igual ao número de colunas', correct: true },
        { id: 2, text: 'Elementos apenas na diagonal principal', correct: false },
        { id: 3, text: 'Elementos apenas quadrados perfeitos', correct: false },
        { id: 4, text: 'Determinante sempre igual a 1', correct: false }
      ],
      explanation: 'Uma matriz quadrada tem o mesmo número de linhas e colunas'
    }
  ],
  3: [
    {
      id: 1,
      text: 'Qual unidade do Sistema Internacional é usada para medir força?',
      options: [
        { id: 1, text: 'Watt', correct: false },
        { id: 2, text: 'Joule', correct: false },
        { id: 3, text: 'Newton', correct: true },
        { id: 4, text: 'Pascal', correct: false }
      ],
      explanation: 'A unidade de força no Sistema Internacional é o Newton (N)'
    },
    {
      id: 2,
      text: 'O movimento de um objeto sob ação apenas da gravidade é chamado de:',
      options: [
        { id: 1, text: 'Movimento retilíneo uniforme', correct: false },
        { id: 2, text: 'Movimento circular uniforme', correct: false },
        { id: 3, text: 'Movimento harmônico simples', correct: false },
        { id: 4, text: 'Movimento uniformemente variado', correct: true }
      ],
      explanation: 'Um objeto sob ação apenas da gravidade experimenta uma aceleração constante, caracterizando um movimento uniformemente variado'
    },
    {
      id: 3,
      text: 'Qual das seguintes afirmações sobre a primeira lei de Newton é verdadeira?',
      options: [
        { id: 1, text: 'Um corpo está sempre em movimento', correct: false },
        { id: 2, text: 'A força resultante é igual à massa vezes a aceleração', correct: false },
        { id: 3, text: 'Um corpo em repouso permanece em repouso e um corpo em movimento permanece em movimento em linha reta, a menos que uma força atue sobre ele', correct: true },
        { id: 4, text: 'A cada ação corresponde uma reação, de mesma intensidade e direção, mas sentido oposto', correct: false }
      ],
      explanation: 'A primeira lei de Newton, também conhecida como Lei da Inércia, estabelece que um corpo tende a manter seu estado de movimento ou repouso a menos que uma força atue sobre ele'
    },
    {
      id: 4,
      text: 'A segunda lei de Newton é representada matematicamente por:',
      options: [
        { id: 1, text: 'F = m × a', correct: true },
        { id: 2, text: 'F = m / a', correct: false },
        { id: 3, text: 'F = a / m', correct: false },
        { id: 4, text: 'F = m × v', correct: false }
      ],
      explanation: 'A segunda lei de Newton estabelece que a força resultante (F) é igual ao produto da massa (m) pela aceleração (a)'
    },
    {
      id: 5,
      text: 'O que é momento linear (quantidade de movimento)?',
      options: [
        { id: 1, text: 'O produto da força pela velocidade', correct: false },
        { id: 2, text: 'O produto da massa pela velocidade', correct: true },
        { id: 3, text: 'O produto da aceleração pelo tempo', correct: false },
        { id: 4, text: 'O produto da força pelo deslocamento', correct: false }
      ],
      explanation: 'Momento linear ou quantidade de movimento é definido como o produto da massa de um objeto pela sua velocidade (p = m × v)'
    }
  ],
  4: [
    {
      id: 1,
      text: 'Qual evento marcou o início do período denominado "Era Vargas" no Brasil?',
      options: [
        { id: 1, text: 'Proclamação da República', correct: false },
        { id: 2, text: 'Revolução de 1930', correct: true },
        { id: 3, text: 'Golpe Militar de 1964', correct: false },
        { id: 4, text: 'Independência do Brasil', correct: false }
      ],
      explanation: 'A Era Vargas teve início com a Revolução de 1930, movimento que depôs o presidente Washington Luís e impediu a posse do presidente eleito Júlio Prestes, levando Getúlio Vargas ao poder'
    },
    {
      id: 2,
      text: 'Qual foi o período da história do Brasil conhecido como "República Velha"?',
      options: [
        { id: 1, text: '1822-1889', correct: false },
        { id: 2, text: '1889-1930', correct: true },
        { id: 3, text: '1930-1945', correct: false },
        { id: 4, text: '1945-1964', correct: false }
      ],
      explanation: 'A República Velha ou Primeira República corresponde ao período entre a Proclamação da República em 1889 até a Revolução de 1930'
    },
    {
      id: 3,
      text: 'Qual destes eventos ocorreu durante o período colonial brasileiro?',
      options: [
        { id: 1, text: 'Guerra do Paraguai', correct: false },
        { id: 2, text: 'Inconfidência Mineira', correct: true },
        { id: 3, text: 'Revolução Farroupilha', correct: false },
        { id: 4, text: 'Proclamação da República', correct: false }
      ],
      explanation: 'A Inconfidência Mineira, movimento separatista ocorrido em Minas Gerais em 1789, aconteceu durante o período colonial, quando o Brasil ainda era uma colônia de Portugal'
    },
    {
      id: 4,
      text: 'O período da história do Brasil conhecido como "Ditadura Militar" ocorreu entre:',
      options: [
        { id: 1, text: '1945-1964', correct: false },
        { id: 2, text: '1964-1985', correct: true },
        { id: 3, text: '1930-1945', correct: false },
        { id: 4, text: '1985-2002', correct: false }
      ],
      explanation: 'A Ditadura Militar no Brasil iniciou-se com o golpe de 1964, que depôs o presidente João Goulart, e durou até 1985, com a eleição indireta de Tancredo Neves'
    },
    {
      id: 5,
      text: 'Qual foi o principal movimento pela independência ocorrido no Nordeste do Brasil no século XVII?',
      options: [
        { id: 1, text: 'Guerra dos Farrapos', correct: false },
        { id: 2, text: 'Revolta dos Alfaiates', correct: false },
        { id: 3, text: 'Insurreição Pernambucana', correct: true },
        { id: 4, text: 'Revolta dos Malês', correct: false }
      ],
      explanation: 'A Insurreição Pernambucana (1645-1654) foi um movimento que expulsou os holandeses do Nordeste brasileiro. Foi um importante movimento de resistência que contou com a participação de diversos segmentos da sociedade colonial'
    }
  ],
  5: [
    {
      id: 1,
      text: 'Na estrutura da redação do ENEM, a introdução deve:',
      options: [
        { id: 1, text: 'Apresentar a conclusão do texto antecipadamente', correct: false },
        { id: 2, text: 'Apresentar o tema e a tese que será defendida', correct: true },
        { id: 3, text: 'Contar uma história pessoal relacionada ao tema', correct: false },
        { id: 4, text: 'Listar todos os argumentos que serão desenvolvidos', correct: false }
      ],
      explanation: 'A introdução da redação do ENEM deve apresentar o tema proposto e a tese (ponto de vista) que será defendida ao longo do texto'
    },
    {
      id: 2,
      text: 'Qual é a função do desenvolvimento na estrutura da redação do ENEM?',
      options: [
        { id: 1, text: 'Reapresentar a tese de forma resumida', correct: false },
        { id: 2, text: 'Criar uma narrativa ficcional sobre o tema', correct: false },
        { id: 3, text: 'Expandir e fundamentar a tese com argumentos', correct: true },
        { id: 4, text: 'Propor uma intervenção para o problema', correct: false }
      ],
      explanation: 'No desenvolvimento, o texto deve apresentar argumentos e evidências que fundamentem a tese apresentada na introdução'
    },
    {
      id: 3,
      text: 'Na redação do ENEM, a conclusão deve conter:',
      options: [
        { id: 1, text: 'Uma proposta de intervenção detalhada e viável', correct: true },
        { id: 2, text: 'Novos argumentos não mencionados anteriormente', correct: false },
        { id: 3, text: 'Uma pergunta reflexiva para o leitor', correct: false },
        { id: 4, text: 'Um resumo de tudo que foi dito no texto', correct: false }
      ],
      explanation: 'A conclusão da redação do ENEM deve conter uma proposta de intervenção para o problema discutido, respeitando os direitos humanos e apresentando agente, ação, meio, finalidade e detalhamento'
    },
    {
      id: 4,
      text: 'Qual dessas características NÃO é recomendada em uma redação do ENEM?',
      options: [
        { id: 1, text: 'Uso da norma culta da língua portuguesa', correct: false },
        { id: 2, text: 'Texto exclusivamente em primeira pessoa', correct: true },
        { id: 3, text: 'Respeito aos direitos humanos', correct: false },
        { id: 4, text: 'Coerência e coesão textual', correct: false }
      ],
      explanation: 'Uma redação argumentativa formal como a do ENEM deve preferencialmente utilizar a terceira pessoa, garantindo maior objetividade e impessoalidade. O uso exclusivo da primeira pessoa tende a deixar o texto muito pessoal'
    },
    {
      id: 5,
      text: 'O que é a competência 5 da redação do ENEM?',
      options: [
        { id: 1, text: 'Domínio da norma culta', correct: false },
        { id: 2, text: 'Compreensão do tema proposto', correct: false },
        { id: 3, text: 'Organização das ideias em um texto coeso', correct: false },
        { id: 4, text: 'Elaboração de proposta de intervenção para o problema abordado', correct: true }
      ],
      explanation: 'A competência 5 da redação do ENEM avalia a capacidade do candidato de elaborar uma proposta de intervenção para o problema abordado, respeitando os direitos humanos'
    }
  ]
};

// Função auxiliar
const getQuestionsForSkill = (skillId: number) => mockQuestions[skillId] || [];

export default function Practice() {
  const params = useParams<{ skillId: string }>();
  const [, setLocation] = useLocation();
  
  const skillId = Number(params.skillId);
  const questions = getQuestionsForSkill(skillId);
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [startTime, setStartTime] = useState<number>(Date.now());
  
  const question = questions[currentQuestion - 1];
  const progress = (currentQuestion / questions.length) * 100;
  
  useEffect(() => {
    // Reset state when component mounts
    setCurrentQuestion(1);
    setSelectedAnswers({});
  }, []);
  
  const handleSelectAnswer = useCallback((optionId: number) => {
    if (selectedOptionId !== null || showExplanation) return;
    
    setSelectedOptionId(optionId);
    setSelectedAnswers(prev => ({...prev, [question.id]: optionId}));
    
    // Reproduzir som correto ou incorreto
    const selectedOption = question.options.find(option => option.id === optionId);
    if (selectedOption) {
      // Tocar som baseado na resposta
      if (selectedOption.correct) {
        playSound('correct');
      } else {
        playSound('incorrect');
      }
    }
    
    // Show explanation after a short delay
    setTimeout(() => {
      setShowExplanation(true);
    }, 500);
  }, [question, selectedOptionId, showExplanation]);
  
  const handleNextQuestion = useCallback(() => {
    setShowExplanation(false);
    setSelectedOptionId(null);
    
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Practice completed, calculate time and show celebration
      const endTime = Date.now();
      const elapsedTimeSeconds = Math.floor((endTime - startTime) / 1000);
      setLocation(`/celebration?time=${elapsedTimeSeconds}`);
    }
  }, [currentQuestion, questions.length, setLocation, startTime]);
  
  const handleExitPractice = useCallback(() => {
    setLocation(`/skill-tree/${skillId}`);
  }, [setLocation, skillId]);
  
  if (!question) return null;
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <button onClick={handleExitPractice}>
            <span className="material-icons">close</span>
          </button>
          <ProgressBar progress={progress} width="w-36" />
          <span className="text-sm font-semibold">{currentQuestion}/{questions.length}</span>
        </div>
      </header>

      {/* Question Content */}
      <div className="p-4 pb-20 max-w-4xl mx-auto w-full">
        <div className="card mb-6">
          <p className="font-nunito mb-6">{question.text}</p>
          
          <div className="space-y-3">
            {question.options.map(option => (
              <QuestionOption
                key={option.id}
                option={option}
                isSelected={selectedOptionId === option.id}
                isCorrect={showExplanation ? option.correct : undefined}
                onClick={() => handleSelectAnswer(option.id)}
                disabled={showExplanation || selectedOptionId !== null}
              />
            ))}
          </div>
        </div>
        
        {/* Answer Explanation */}
        {showExplanation && (
          <div className="card mb-6">
            <div className="border-l-4 border-[#4CAF50] p-3 bg-green-50 rounded">
              <p className="text-sm">{question.explanation}</p>
            </div>
            <button className="btn-primary w-full py-3 mt-4" onClick={handleNextQuestion}>
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
