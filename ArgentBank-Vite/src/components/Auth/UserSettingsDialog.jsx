import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile } from "../../store/slices/authSlice";
import * as Dialog from "@radix-ui/react-dialog";

function UserSettingsDialog({ trigger, dialogTitle }) {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  
  const [userName, setUserName] = useState("");
  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

// Quand le dialog s'ouvre, on récupère les données de l'utilisateur
  useEffect(() => {
    if (isDialogOpen) {
      dispatch(fetchUserProfile());
    }
  }, [isDialogOpen, dispatch]);


// Quand userName du component change, on met à jour la valeur userName du store
  useEffect(() => {
    if (user?.userName) {
      setUserName(user.userName);
    }
  }, [user]);


  // Envoie la nouvelle valeur userName au store/API
  const handleSave = async () => {
    try {

      // Si userName est vide, on affiche un message d'erreur
      // .trim() = supprime les espaces en début et en fin de string
      if (!userName.trim()) {
        setLocalError("Username cannot be empty");
        return;
      }

      // On met à jour le state userName
      // .unwrap() = méthode Redux Toolkit qui permet de récupérer la réponse de l'API
      await dispatch(updateUserProfile({ userName })).unwrap();
      setLocalError(null);
      setSuccessMessage("Profile updated successfully!");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error saving changes:", err);
      setLocalError(err.message || "Failed to save changes");
    }
  };

  const renderUserInfo = (label, value) => (
    <div className="mt-4">
      <label className="block font-bold">{label}</label>
      <p className="text-gray-700">{value || <span className="italic text-gray-400">Not provided</span>}</p>
    </div>
  );

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed bg-white p-6 rounded-md shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md">
          <Dialog.Title className="text-lg font-bold">
            {dialogTitle || "Edit Profile"}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500">
            Update your user information below.
          </Dialog.Description>

          {/* Show loading state if data is not ready */}
          {isLoading && !user ? (
            <div className="mt-4 text-gray-500 italic">Loading user info...</div>
          ) : (
            <>
              {renderUserInfo("Email", user?.email)}
              {renderUserInfo("First Name", user?.firstName)}
              {renderUserInfo("Last Name", user?.lastName)}
              {renderUserInfo("Current Username", user?.userName)}

              <div className="mt-4">
                <label className="block font-bold">New Username</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="block w-full mt-1 p-2 border rounded-md"
                  placeholder="Enter your new username"
                />
              </div>
            </>
          )}

          {(error || localError) && (
            <div className="mt-2 text-red-600 text-sm">
              {error || localError}
            </div>
          )}

          {successMessage && (
            <div className="mt-2 text-green-600 text-sm">
              {successMessage}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="px-4 py-2 border rounded-md hover:bg-gray-100">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              disabled={isLoading || !user}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-400"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default UserSettingsDialog;
