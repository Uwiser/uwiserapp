FROM mcr.microsoft.com/dotnet/core/sdk:3.1-alpine AS build-env
WORKDIR /app

RUN echo 'Copiar csproj e restaurar dependencias'
COPY *.csproj ./
RUN dotnet restore

RUN echo 'build da aplicação'
COPY . ./
RUN dotnet publish -c Release -o out

RUN echo 'Build da imagem'
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1

WORKDIR /app
COPY --from=build-env /app/out .
COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

ENTRYPOINT ["dotnet", "uwiserapi.dll","--no-lauch-profile"]