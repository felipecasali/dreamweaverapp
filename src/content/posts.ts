import type { Locale } from "@/i18n/routing";

/** Body blocks: lines starting with "## " are subheadings, everything else is a paragraph. */
type Localized = { title: string; description: string; body: string[] };

export type Post = {
  slug: string;
  date: string; // ISO date, shown on the page and in the sitemap
  sources: { label: string; url: string }[];
  content: Record<Locale, Localized>;
};

const NICHD_REM = {
  label: "NICHD — ¿Qué es el sueño REM?",
  url: "https://espanol.nichd.nih.gov/salud/temas/sleep/informacion/rem",
};
const ALZ_META = {
  label: "Sleep in Alzheimer's disease: a systematic review and meta-analysis of polysomnographic findings (Translational Psychiatry, 2022)",
  url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8976015/",
};
const ADI = { label: "Alzheimer's Disease International", url: "https://www.alzint.org" };

export const posts: Post[] = [
  {
    slug: "how-dreams-work",
    date: "2026-11-05",
    sources: [NICHD_REM],
    content: {
      en: {
        title: "How do dreams work? What science says",
        description: "REM sleep, memory and emotion: what research tells us about why we dream, and why we forget.",
        body: [
          "Dreams are the stories the sleeping brain tells itself: images, feelings and fragments of memory stitched together, sometimes vivid, sometimes gone a minute after waking.",
          "## The REM stage",
          "The most vivid dreams happen during REM sleep, when the eyes move quickly under closed lids and most muscles are temporarily relaxed. Brain activity in this stage looks close to wakefulness, especially in regions linked to emotion and memory, while areas tied to planning and logic are quieter. That mix helps explain why dreams feel intense and make little sense.",
          "## Why we dream",
          "There is no single accepted answer. Three ideas have strong support: dreams help process the emotions of the day, they take part in sorting and strengthening memories, and their loose logic lets the mind combine ideas in unexpected ways.",
          "## Why dreams fade",
          "The chemistry of REM sleep is not set up to store new memories. Unless you wake during or right after a dream and think about it, it rarely makes it into long-term memory. Writing it down in the first minutes after waking is the most reliable way to keep it.",
        ],
      },
      pt: {
        title: "Como os sonhos funcionam? O que a ciência diz",
        description: "Sono REM, memória e emoção: o que a pesquisa diz sobre por que sonhamos e por que esquecemos.",
        body: [
          "Sonhos são as histórias que o cérebro conta a si mesmo durante o sono: imagens, sentimentos e fragmentos de memória costurados, às vezes nítidos, às vezes esquecidos um minuto depois de acordar.",
          "## O estágio REM",
          "Os sonhos mais vívidos acontecem no sono REM, quando os olhos se movem rápido sob as pálpebras e a maior parte dos músculos fica temporariamente relaxada. A atividade cerebral nessa fase se parece com a da vigília, sobretudo em regiões ligadas à emoção e à memória, enquanto áreas de planejamento e lógica ficam mais quietas. Essa combinação ajuda a explicar por que os sonhos são intensos e fazem pouco sentido.",
          "## Por que sonhamos",
          "Não há uma resposta única aceita. Três ideias têm bom respaldo: os sonhos ajudam a processar as emoções do dia, participam da organização e do fortalecimento das memórias, e sua lógica solta permite combinar ideias de formas inesperadas.",
          "## Por que os sonhos somem",
          "A química do sono REM não favorece a gravação de novas memórias. A menos que você acorde durante ou logo depois do sonho e pense nele, ele raramente chega à memória de longo prazo. Anotar nos primeiros minutos depois de acordar é a forma mais segura de guardá-lo.",
        ],
      },
      es: {
        title: "¿Cómo funcionan los sueños? Lo que dice la ciencia",
        description: "Sueño REM, memoria y emoción: lo que dice la investigación sobre por qué soñamos y por qué olvidamos.",
        body: [
          "Los sueños son las historias que el cerebro se cuenta a sí mismo mientras dormimos: imágenes, emociones y fragmentos de memoria hilados, a veces nítidos, a veces olvidados un minuto después de despertar.",
          "## La fase REM",
          "Los sueños más vívidos ocurren en el sueño REM, cuando los ojos se mueven rápido bajo los párpados y la mayoría de los músculos queda relajada temporalmente. La actividad cerebral en esta fase se parece a la de la vigilia, sobre todo en regiones ligadas a la emoción y la memoria, mientras que las zonas de planificación y lógica están más calladas. Esa mezcla ayuda a explicar por qué los sueños son intensos y tienen poco sentido.",
          "## Por qué soñamos",
          "No hay una única respuesta aceptada. Tres ideas tienen buen respaldo: los sueños ayudan a procesar las emociones del día, participan en ordenar y reforzar los recuerdos, y su lógica suelta permite combinar ideas de formas inesperadas.",
          "## Por qué se olvidan",
          "La química del sueño REM no favorece guardar recuerdos nuevos. Salvo que despiertes durante o justo después de un sueño y pienses en él, rara vez llega a la memoria de largo plazo. Anotarlo en los primeros minutos tras despertar es la forma más segura de conservarlo.",
        ],
      },
    },
  },
  {
    slug: "dream-perspectives",
    date: "2026-11-05",
    sources: [],
    content: {
      en: {
        title: "Dreams from different perspectives",
        description: "How medicine, psychology, spiritual traditions and religions have read dreams across cultures.",
        body: [
          "The same dream can be read in very different ways depending on who is reading it. Science asks how dreaming works; many cultures ask what a dream means.",
          "## Medicine and psychology",
          "Clinicians look at dreams as a reflection of mental and emotional state. Stress and unresolved worries tend to show up in dream content, and repeated nightmares can be one sign of conditions such as anxiety or post-traumatic stress, which deserve a professional's attention.",
          "## Spiritual readings",
          "Some traditions, and Carl Jung's psychology in its own way, treat dreams as messages from a deeper layer of the self, or as a bridge to intuition and to images shared across humanity.",
          "## Religious traditions",
          "In Jewish, Christian and Islamic texts, dreams appear as a channel for warnings and revelation, as in the story of Joseph. Hindu and Buddhist thought connects dreams to the illusory nature of experience, and Tibetan dream yoga uses lucid dreaming as a practice. Many Indigenous cultures see dreams as contact with ancestors and the spirit world.",
          "## Holding several readings at once",
          "These views do not have to compete. A dream can be a product of REM sleep and still carry personal meaning. Reading it through more than one lens is often where the insight comes from.",
        ],
      },
      pt: {
        title: "Os sonhos por diferentes perspectivas",
        description: "Como a medicina, a psicologia, as tradições espirituais e as religiões leram os sonhos em diferentes culturas.",
        body: [
          "O mesmo sonho pode ser lido de formas muito diferentes, conforme quem lê. A ciência pergunta como o sonhar funciona; muitas culturas perguntam o que um sonho significa.",
          "## Medicina e psicologia",
          "Para a clínica, os sonhos refletem o estado mental e emocional. Estresse e preocupações não resolvidas costumam aparecer no conteúdo dos sonhos, e pesadelos repetidos podem ser um sinal de quadros como ansiedade ou estresse pós-traumático, que merecem atenção profissional.",
          "## Leituras espirituais",
          "Algumas tradições, e a psicologia de Carl Jung à sua maneira, tratam os sonhos como mensagens de uma camada mais profunda de nós, ou como ponte para a intuição e para imagens compartilhadas pela humanidade.",
          "## Tradições religiosas",
          "Nos textos judaicos, cristãos e islâmicos, os sonhos aparecem como canal de avisos e revelação, como na história de José. O pensamento hindu e budista liga os sonhos à natureza ilusória da experiência, e a ioga dos sonhos tibetana usa o sonho lúcido como prática. Muitas culturas indígenas veem os sonhos como contato com os ancestrais e o mundo espiritual.",
          "## Várias leituras ao mesmo tempo",
          "Essas visões não precisam competir. Um sonho pode ser produto do sono REM e ainda assim ter significado pessoal. Ler por mais de uma perspectiva costuma ser de onde vem a percepção.",
        ],
      },
      es: {
        title: "Los sueños desde distintas perspectivas",
        description: "Cómo la medicina, la psicología, las tradiciones espirituales y las religiones han leído los sueños en distintas culturas.",
        body: [
          "Un mismo sueño puede leerse de maneras muy distintas según quién lo lea. La ciencia pregunta cómo funciona el soñar; muchas culturas preguntan qué significa un sueño.",
          "## Medicina y psicología",
          "Para la clínica, los sueños reflejan el estado mental y emocional. El estrés y las preocupaciones sin resolver suelen aparecer en su contenido, y las pesadillas repetidas pueden ser una señal de cuadros como ansiedad o estrés postraumático, que merecen atención profesional.",
          "## Lecturas espirituales",
          "Algunas tradiciones, y a su manera la psicología de Carl Jung, tratan los sueños como mensajes de una capa más profunda de nosotros, o como puente hacia la intuición y hacia imágenes compartidas por la humanidad.",
          "## Tradiciones religiosas",
          "En los textos judíos, cristianos e islámicos, los sueños aparecen como canal de advertencias y revelación, como en la historia de José. El pensamiento hindú y budista vincula los sueños con la naturaleza ilusoria de la experiencia, y el yoga de los sueños tibetano usa el sueño lúcido como práctica. Muchas culturas indígenas ven los sueños como contacto con los ancestros y el mundo espiritual.",
          "## Varias lecturas a la vez",
          "Estas miradas no tienen por qué competir. Un sueño puede ser producto del sueño REM y aun así tener sentido personal. Leerlo desde más de una perspectiva suele ser de donde viene la comprensión.",
        ],
      },
    },
  },
  {
    slug: "introducing-dream-weaver",
    date: "2026-11-05",
    sources: [],
    content: {
      en: {
        title: "Dream Weaver: turning dreams into a journal you can read",
        description: "What Dream Weaver does, how interpretations work, and how your dreams are kept private.",
        body: [
          "Most dreams are gone before breakfast. Dream Weaver exists to catch them in the first minutes after waking and to give you a way to look at them again later.",
          "## Write first, interpret second",
          "You write the dream the way you remember it. Then you choose a lens — balanced, Freudian, Jungian, emotional, spiritual, cultural symbols or sleep science — and receive a reading. If a reading doesn't fit, you can read the same dream another way; every reading stays attached to that one entry.",
          "## A journal, not a feed",
          "Entries are private to your account. You can search them, see the general mood of your recent dreams, and notice the images that keep coming back.",
          "## Your data",
          "Dreams are not used to train AI models unless you turn that on. You can export everything as a file or delete your account from the account page at any time.",
          "The first three interpretations are free.",
        ],
      },
      pt: {
        title: "Dream Weaver: transformar sonhos num diário que se pode ler",
        description: "O que o Dream Weaver faz, como funcionam as interpretações e como seus sonhos ficam privados.",
        body: [
          "A maioria dos sonhos some antes do café da manhã. O Dream Weaver existe para registrá-los nos primeiros minutos depois de acordar e dar a você um jeito de olhar para eles de novo depois.",
          "## Primeiro escrever, depois interpretar",
          "Você escreve o sonho como lembra. Depois escolhe uma perspectiva — equilibrada, freudiana, junguiana, emocional, espiritual, símbolos populares ou ciência do sono — e recebe uma leitura. Se ela não fizer sentido, você pode ler o mesmo sonho de outro jeito; todas as leituras ficam na mesma entrada.",
          "## Um diário, não um feed",
          "As entradas são privadas da sua conta. Você pode pesquisá-las, ver o clima geral dos seus sonhos recentes e perceber as imagens que se repetem.",
          "## Seus dados",
          "Os sonhos não são usados para treinar modelos de IA, a menos que você ative isso. Você pode exportar tudo em um arquivo ou excluir sua conta na página da conta quando quiser.",
          "As três primeiras interpretações são grátis.",
        ],
      },
      es: {
        title: "Dream Weaver: convertir los sueños en un diario que se puede leer",
        description: "Qué hace Dream Weaver, cómo funcionan las interpretaciones y cómo tus sueños se mantienen privados.",
        body: [
          "La mayoría de los sueños se borra antes del desayuno. Dream Weaver existe para atraparlos en los primeros minutos tras despertar y darte una forma de volver a mirarlos después.",
          "## Primero escribir, después interpretar",
          "Escribes el sueño como lo recuerdas. Luego eliges una perspectiva — equilibrada, freudiana, junguiana, emocional, espiritual, símbolos populares o ciencia del sueño — y recibes una lectura. Si no encaja, puedes leer el mismo sueño de otra forma; todas las lecturas quedan en la misma entrada.",
          "## Un diario, no un feed",
          "Las entradas son privadas de tu cuenta. Puedes buscarlas, ver el tono general de tus sueños recientes y notar las imágenes que se repiten.",
          "## Tus datos",
          "Los sueños no se usan para entrenar modelos de IA salvo que lo actives. Puedes exportar todo en un archivo o eliminar tu cuenta desde la página de cuenta cuando quieras.",
          "Las tres primeras interpretaciones son gratis.",
        ],
      },
    },
  },
  {
    slug: "alzheimers-and-dreams",
    date: "2026-11-05",
    sources: [ALZ_META, ADI],
    content: {
      en: {
        title: "The fading dream world: how Alzheimer's affects dreams",
        description: "Less REM sleep, fewer remembered dreams and changes in dream content: what is known about Alzheimer's and dreaming.",
        body: [
          "Alzheimer's disease changes the night as well as the day. Families often notice sleep problems long before they connect them to dreaming.",
          "## Fewer remembered dreams",
          "People with Alzheimer's frequently report fewer dreams. The likelier change is in remembering them: the hippocampus, which helps turn experiences into lasting memories, is one of the first regions the disease affects.",
          "## Less REM sleep",
          "Sleep studies comparing people with Alzheimer's to people without it consistently find less time in REM sleep and more fragmented nights. Because REM sleep is involved in memory and emotional balance, researchers are studying whether this loss also feeds the progression of symptoms.",
          "## Changes in what is dreamed",
          "Caregivers and some studies describe dreams that become more fragmented, and at times more anxious or sad, in earlier stages of the disease. The evidence here is still limited.",
          "## Why it matters",
          "Changes in sleep and dreaming are being explored as possible early signals of the disease. If you are caring for someone and notice them, they are worth mentioning to the person's doctor.",
        ],
      },
      pt: {
        title: "O mundo dos sonhos que se apaga: como o Alzheimer afeta os sonhos",
        description: "Menos sono REM, menos sonhos lembrados e mudanças no conteúdo: o que se sabe sobre Alzheimer e o sonhar.",
        body: [
          "A doença de Alzheimer muda a noite tanto quanto o dia. Muitas famílias percebem problemas de sono bem antes de relacioná-los aos sonhos.",
          "## Menos sonhos lembrados",
          "Pessoas com Alzheimer costumam relatar menos sonhos. A mudança mais provável está em lembrar deles: o hipocampo, que ajuda a transformar experiências em memórias duradouras, é uma das primeiras regiões afetadas pela doença.",
          "## Menos sono REM",
          "Estudos do sono que comparam pessoas com e sem Alzheimer encontram, de forma consistente, menos tempo em sono REM e noites mais fragmentadas. Como o sono REM participa da memória e do equilíbrio emocional, pesquisadores investigam se essa perda também alimenta a progressão dos sintomas.",
          "## Mudanças no que se sonha",
          "Cuidadores e alguns estudos descrevem sonhos mais fragmentados e, às vezes, mais ansiosos ou tristes nas fases iniciais da doença. As evidências aqui ainda são limitadas.",
          "## Por que isso importa",
          "Mudanças no sono e nos sonhos estão sendo estudadas como possíveis sinais precoces da doença. Se você cuida de alguém e as percebe, vale comentar com o médico dessa pessoa.",
        ],
      },
      es: {
        title: "El mundo de los sueños que se apaga: cómo el Alzheimer afecta a los sueños",
        description: "Menos sueño REM, menos sueños recordados y cambios en su contenido: lo que se sabe sobre el Alzheimer y el soñar.",
        body: [
          "La enfermedad de Alzheimer cambia la noche tanto como el día. Muchas familias notan problemas de sueño mucho antes de relacionarlos con los sueños.",
          "## Menos sueños recordados",
          "Las personas con Alzheimer suelen contar menos sueños. El cambio más probable está en recordarlos: el hipocampo, que ayuda a convertir las experiencias en recuerdos duraderos, es una de las primeras regiones que afecta la enfermedad.",
          "## Menos sueño REM",
          "Los estudios del sueño que comparan a personas con y sin Alzheimer encuentran de forma constante menos tiempo en sueño REM y noches más fragmentadas. Como el sueño REM interviene en la memoria y el equilibrio emocional, los investigadores estudian si esa pérdida también alimenta la progresión de los síntomas.",
          "## Cambios en lo que se sueña",
          "Cuidadores y algunos estudios describen sueños más fragmentados y, a veces, más ansiosos o tristes en las primeras etapas de la enfermedad. La evidencia aquí todavía es limitada.",
          "## Por qué importa",
          "Los cambios en el sueño y en los sueños se estudian como posibles señales tempranas de la enfermedad. Si cuidas a alguien y los notas, vale la pena comentarlo con su médico.",
        ],
      },
    },
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
