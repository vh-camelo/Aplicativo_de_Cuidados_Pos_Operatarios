import { useState } from "react";
import { useNavigate } from "react-router";
import { Hospital, User, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

interface Profile {
  id: string;
  nome: string;
}

export function Login() {
  const navigate = useNavigate();


  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem("profiles");
    return saved ? JSON.parse(saved) : [];
  });

  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);


  const handleSelectProfile = (profile: Profile) => {
    localStorage.setItem("active_profile", profile.id);
    navigate("/menu");
  };


  const handleDeleteClick = (e: React.MouseEvent, profile: Profile) => {
    e.stopPropagation(); 
    setDeleteTarget(profile);
  };


  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    localStorage.removeItem(`${deleteTarget.id}_patient_info`);
    localStorage.removeItem(`${deleteTarget.id}_pain_records`);
    localStorage.removeItem(`${deleteTarget.id}_checklist_items`);
    localStorage.removeItem(`${deleteTarget.id}_checklist_day`);
    localStorage.removeItem(`${deleteTarget.id}_emergency_contacts`);


    const updated = profiles.filter(p => p.id !== deleteTarget.id);
    setProfiles(updated);
    localStorage.setItem("profiles", JSON.stringify(updated));

    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Hospital className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl">Cuidados Pós-Operatórios</CardTitle>
          <CardDescription>
            Selecione seu perfil para continuar
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">

          {/* Lista de perfis */}
          {profiles.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-4">
              Nenhum perfil cadastrado ainda.
            </p>
          )}

          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
              onClick={() => handleSelectProfile(profile)}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="flex-1 font-medium">{profile.nome}</span>
              <button
                onClick={(e) => handleDeleteClick(e, profile)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Botão novo perfil */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
            onClick={() => navigate("/setup")}
          >
            + Novo Perfil
          </Button>

        </CardContent>
      </Card>

      {/* Modal de confirmação de exclusão */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Excluir Perfil</h2>
            <p className="text-sm text-gray-500">
              Tem certeza que deseja excluir o perfil de{" "}
              <strong>{deleteTarget.nome}</strong>? Todos os dados serão
              apagados e essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Sim, excluir
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}