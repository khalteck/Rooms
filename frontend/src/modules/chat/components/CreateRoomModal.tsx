import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { toast } from "sonner";
import { useAppPost } from "../../../hooks";
import { apiRoutes } from "../../../helpers/apiRoutes";
import { Room } from "../../../types";

interface CreateRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomCreated?: () => void;
}

interface CreateRoomData {
  participantEmail: string;
}

interface CreateRoomResponse {
  room: Room;
}

export function CreateRoomModal({
  open,
  onOpenChange,
  onRoomCreated,
}: CreateRoomModalProps) {
  const [email, setEmail] = useState("");

  const { mutate: createRoom, isPending } = useAppPost<
    CreateRoomResponse,
    CreateRoomData
  >(
    apiRoutes.rooms.createRoom,
    {},
    {
      showError: true,
      onSuccess: (data) => {
        toast.success(`Room with "${email}" created successfully`);
        setEmail("");
        onOpenChange(false);
        onRoomCreated?.();
      },
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    createRoom({ participantEmail: email.trim() });
  };

  const handleClose = () => {
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter the email of the person you want to chat with.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* <div className="space-y-2">
              <Label htmlFor="name">Room Name</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="My Chat Room"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-background border-border"
                  required
                />
              </div>
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background border-border"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-border"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending ? "Creating..." : "Create Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
