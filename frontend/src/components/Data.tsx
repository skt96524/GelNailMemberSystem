export default function Data(props: { data: any }) {
  return (
    <pre>
      <code>{JSON.stringify(props, null, 2)}</code>
    </pre>
  );
}
