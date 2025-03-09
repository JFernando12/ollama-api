import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";

const comparePhrases = async ({ frase1, frase2 }: { frase1: string, frase2: string }) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Eres un experto comparando frases, no se trata de comparar palabras, se trata de comparar significado emperico.
        Responde si ambas frases están relacionadas o no tienen que ver, además un porcentaje de coincidencia de 0 a 100.
        Ejemplo1: frase1: "cuaderno de pasta dura y hojas de cuadro chico" y frase2 "servicios de lavanderia", respuesta "coincide: false, porcentaje: 0";
        Ejemplo2: frase1 "almuerzo con café y fruta" y  frase2 "servicios de catering y alimentos para eventos", respuesta "coincide: true, porcentaje: 90";
        Ejemplo3: frase1 "almuerzo con café y fruta" y  frase2 "desayuno", respuesta "coincide: true, porcentaje: 60";
        Ejemplo4: frase1 "bote de basura" y  frase2 "servicios de limpieza", respuesta "coincide: true, porcentaje: 70";
        Ejemplo5: frase1 "computadora" y frase2 "servicios de internet", respuesta "coincide: false, porcentaje: 40";
        Formatear todas las respuestas como objetos JSON con dos claves: "coincide" y "porcentaje".`,
    ],
    ["human", `Compara  Frase1: "{frase1}" y Frase2: "{frase2}".`],
  ]);

  const model = new ChatOllama({
    model: "llama3.2",
    temperature: 0.5,
    format: "json",
  });

  const chain = prompt.pipe(model);

  const result = await chain.invoke({
    frase1,
    frase2,
  });

  const content = result.content;
  console.log('content', content);
  const response = JSON.parse(content as string);
  return response;
}

export const ollamaService = {
  comparePhrases
};