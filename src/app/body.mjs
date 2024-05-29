const TITLE = 'Node.js + Redis on Northflank';

const mainBg = 'bg-white';
// const mainBg = "bg-slate-200";

export const getResponseBody = (entries, entryCount) => `
<html lang="en">
    <head>
        <title>${TITLE}</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="xl:w-1/2 p-12 mx-auto ${mainBg}">
        <header class="mb-10">
            <h1 class="text-xl font-semibold mb-5">${TITLE}</h1>
            <form action="/add" method="POST" class="flex">
                <input type="text" name="title" class="w-full border-solid border-2 border-black px-3 py-2 mr-1" />
                <button class="whitespace-nowrap text-white bg-blue-500 border-solid border-2 border-blue-500 px-3 py-2 mr-1">Add entry</button>
                <a href="/delete" >
                    <button type="button" class="whitespace-nowrap text-white bg-red-500 border-solid border-2 border-red-500 px-3 py-2">Delete all</button>
                </a>
            </form>
        </header>
        <div class="italic mb-5">Total number of entries: ${entryCount}</div>
        <div>
            <ul>
                ${entries
                  .map(
                    (e) => `<li class="border-t-solid border-t-2 border-black-500 p-5">${e}</li>`
                  )
                  .join('')}
            </ul>
        </div>
    </body>
</html>
`;
