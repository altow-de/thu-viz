OUTPUT=hyfiveuser@hyfive.info:/home/hyfiveuser/visualization_interface

cp -r public .next/standalone
cp -r .next/static .next/standalone/.next
rsync -a .next/standalone/ $OUTPUT