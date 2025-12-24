import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isLoading, title, description }: DeleteConfirmModalProps) => {
  const { t, dir } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm" dir={dir}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {title || t('delete')}
          </DialogTitle>
        </DialogHeader>
        
        <p className="text-muted-foreground py-4">{description || t('confirmDelete')}</p>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {t('no')}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading} className="flex-1">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : t('yes')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
