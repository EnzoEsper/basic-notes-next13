import Link from "next/link";
import styles from "./Notes.module.css";
import PocketBase from "pocketbase";

// this is the way to customize the caching behavior of the page for the case when using the orm
export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 0,
  fetchCache = "auto",
  runtime = "nodejs",
  preferenceRegion = "auto";

async function getNotes() {
  // this way we fetch data using pocketbase orm and we have to customize the cache exporting certain variables from the page (the dynamic const exported above)
  const pb = new PocketBase("http://127.0.0.1:8090");
  const data = await pb.collection("notes").getList(1, 10);

  // this way we fetch data using fetch and we customize the cache with the cache option
  // const res = await fetch("http://127.0.0.1:8090/api/collections/notes/records?page=1&per_page=10", {
  //   cache: "no-store",
  // });
  // const data = await res.json();

  return data?.items as any[];
}

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div>
      <h1>Notes</h1>
      {notes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
    </div>
  );
}

function Note({ note }: any) {
  const { id, title, content, created } = note || {};

  return (
    <Link href={`/notes/${id}`}>
      <div className={styles.note}>
        <h2>{title}</h2>
        <h5>{content}</h5>
        <p>{created}</p>
      </div>
    </Link>
  );
}
