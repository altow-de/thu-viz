OUTPUT=hyfiveuser@hyfive.info:/home/hyfiveuser/visualization_interface

cp -r public .next/standalone
cp -r .next/static .next/standalone/.next
cp -r pages/scripts .next/standalone/.next/server/pages
rsync -a .next/standalone/ $OUTPUT

