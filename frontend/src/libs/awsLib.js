import { Storage } from "aws-amplify";
import uuid from "uuid";


export async function s3Upload(file) {
  const filename = uuid.v1() + file.name;

  const stored = await Storage.put(filename, file, {
    contentType: file.type
  });

  return stored.key;
}