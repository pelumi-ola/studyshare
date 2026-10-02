import { useState } from "react";
import { Link } from "react-router-dom";
import { api, idOf } from "../lib/api";
import { useCatalog } from "../lib/hooks";
import { useAuth } from "../context/AuthContext";
import ResourceCard from "../components/ResourceCard";
import EditResourceModal from "../components/EditResourceModal";
import {
  Button,
  Empty,
  Loading,
  Modal,
  PageHead,
  useToast,
} from "../components/ui";

export default function MyResources() {
  const { user } = useAuth();
  const { resources, loading, error, reload } = useCatalog();
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const mine = resources.filter((r) => idOf(r.uploadedBy) === user._id);

  const remove = async () => {
    setBusy(true);
    try {
      await api.deleteResource(del._id);
      toast("Resource deleted");
      setDel(null);
      reload();
    } catch (e) {
      toast(e.message, "err");
    }
    setBusy(false);
  };

  return (
    <>
      <PageHead
        title="My uploads"
        action={
          <Link to="/upload">
            <Button variant="marker">Upload new</Button>
          </Link>
        }
      >
        Edit or remove what you've shared.
      </PageHead>
      {loading ? (
        <Loading />
      ) : error ? (
        <Empty title="Couldn't load your uploads">{error}</Empty>
      ) : !mine.length ? (
        <Empty
          title="You haven't uploaded anything yet"
          action={
            <Link to="/upload">
              <Button>Upload your first resource</Button>
            </Link>
          }
        >
          Share a past question or your best lecture notes.
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((r) => (
            <ResourceCard
              key={r._id}
              r={r}
              actions={
                <>
                  <Button
                    variant="ghost"
                    className="flex-1 !py-1.5"
                    onClick={() => setEdit(r)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="soft"
                    className="flex-1 !py-1.5 text-rose-700"
                    onClick={() => setDel(r)}
                  >
                    Delete
                  </Button>
                </>
              }
            />
          ))}
        </div>
      )}
      <EditResourceModal
        open={!!edit}
        resource={edit}
        onClose={() => setEdit(null)}
        onSaved={reload}
      />
      <Modal
        open={!!del}
        onClose={() => setDel(null)}
        title="Delete this resource?"
      >
        <p className="text-sm text-ink/70">
          "{del?.title}" will be removed for everyone. This can't be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDel(null)}>
            Keep it
          </Button>
          <Button variant="danger" loading={busy} onClick={remove}>
            Delete resource
          </Button>
        </div>
      </Modal>
    </>
  );
}
