import { useNavigate } from "react-router";
import { ArrowLeft, PersonStanding, Droplets, Thermometer, Bandage, Play } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

export function PostOperativeCare() {
  const navigate = useNavigate();

  const careInstructions = [
    {
      icon: PersonStanding,
      title: "Exercicios respiratórios",
      color: "text-blue-600",
      video: "/videos/video_curativo_1.mp4",
      items: [
        "",
      ],
    },
    {
      icon: Bandage,
      title: "Cuidados com o Curativo",
      color: "text-green-600",
      video: "/videos/video_curativo_1.mp4",
      items: [
        "Mantenha o curativo limpo e seco",
        "Troque o curativo conforme orientação",
        "Lave as mãos antes e depois de mexer no curativo",
        "Observe sinais de infecção (vermelhidão, calor, secreção)",
      ],
    },
    {
      icon: PersonStanding,
      title: "Mobilidade",
      color: "text-orange-600",
      video: "/videos/video_curativo_1.mp4",
      items: [
        "Respeite o conforto: Movimentar-se é vital, mas nunca deve causar dor aguda",
        "Uso de suportes: Se necessário, utilize equipamentos ortopédicos",
        "Levantar da cama: Nunca levante de forma abrupta. Sente-se na beira da cama, respire fundo e só depois fique em pé com ajuda",
      ],
    },
    {
      icon: Droplets,
      title: "Cuidados com ostomias e drenos",
      color: "text-cyan-600",
      video: "/videos/video_curativo_1.mp4",
      items: [
        "",
      ],
    },
    {
      icon: Thermometer,
      title: "Monitoramento",
      color: "text-red-600",
      video: null,
      items: [
        "Monitore sua temperatura diariamente",
        "Observe a cicatrização da ferida",
        "Registre qualquer sintoma novo ou preocupante",
        "Compareça às consultas de retorno",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/menu")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-lg">Cuidados Pós-Operatórios</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              Siga estas orientações cuidadosamente para garantir uma recuperação
              tranquila e eficaz. Em caso de dúvidas, entre em contato com sua equipe médica.
            </p>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="space-y-4">
          {careInstructions.map((section, index) => {
            const Icon = section.icon;
            return (
              <AccordionItem key={index} value={`item-${index}`} className="border-0">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${section.color}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{section.title}</span>
                        {section.video && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                            <Play className="w-3 h-3" />
                            <span>Vídeo</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0 space-y-4">

                      {/* Vídeo — aparece só se a seção tiver um */}
                      {section.video && (
                        <div className="rounded-lg overflow-hidden bg-black">
                          <video
                            controls
                            className="w-full max-h-64 object-contain"
                            preload="metadata"
                          >
                            <source src={section.video} type="video/mp4" />
                            Seu navegador não suporta reprodução de vídeo.
                          </video>
                        </div>
                      )}

                      {/* Lista de instruções */}
                      <ul className="space-y-2">
                        {section.items.map((item, idx) => (
                          item && (
                            <li key={idx} className="flex gap-2 text-sm text-gray-600">
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          )
                        ))}
                      </ul>

                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}